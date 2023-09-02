import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, ObjectId } from 'mongoose';
import { CreateAdmissionDto } from './dtos/admission.dto';
import { Admission } from 'models/admission.schema';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt'
import { registerReturn } from './interfaces/common.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { otp } from 'models/otp.schema';
import { student } from 'models/student.schema';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import { optDto } from './dtos/otp.dto';
import { loginDto } from './dtos/login.dto';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import { Stripe } from 'stripe';
import { feePaymentDetail } from 'common/interfaces/feePayment.interface';
import { batch } from 'models/batch.schema';
import { leaveApplicationDto } from './dtos/leaveApplication.dto';
import { updateLeaveStatusDto } from '../faculty/dtos/updateLeaveStatus.dto';
import { assignment } from 'models/assignment.schema';
import { fileSubmissionDto } from './dtos/fileSubmission.dto';
import { communityChat } from 'models/community-chat.schema';
import { department } from 'models/department.schema';
import { groupType } from "../chat/interfaces/messageDetails.interface";
import { groupChat } from 'models/group-chat.schema';
import { createGroupDto } from './dtos/createGroup.dto';
import { admissionStatus } from './enums/admissionStatus.enum';
import { faculty } from 'models/faculty.schema';
const stripe = require('stripe')('sk_test_51NZz4dSBX5PVkKd67VpWUNx6INzyDEGDefvjD5LWhBLIhfaXYty48GXYa9aUFa5sDV4RYx0sQZbFfgwScvJcw3Oq00mYsXh5m1');

@Injectable()
export class UserService {
    private stripe: Stripe;
    constructor(
        @InjectModel('admissionEnquiry') private readonly admissionModel: Model<Admission>,
        @InjectModel('otp') private readonly otpModel: Model<otp>,
        @InjectModel('students') private readonly studentModel: Model<student>,
        @InjectModel('batch') private readonly batchModel: Model<batch>,
        @InjectModel('assignment') private readonly assignmentModel: Model<assignment>,
        @InjectModel('communityChat') private readonly communityChatModel: Model<communityChat>,
        @InjectModel('groupChat') private readonly groupChatModel: Model<groupChat>,
        @InjectModel('department') private readonly departmentModel: Model<department>,
    @InjectModel('faculty') private readonly facultyModel: Model<faculty>,
        private mailerService: MailerService,
        private jwtService: JwtService
    ) {
        this.stripe = new Stripe('sk_test_51NZz4dSBX5PVkKd67VpWUNx6INzyDEGDefvjD5LWhBLIhfaXYty48GXYa9aUFa5sDV4RYx0sQZbFfgwScvJcw3Oq00mYsXh5m1', {
            apiVersion: '2022-11-15',
        })
    }

    async gethomeCount(){
        try {
            const studentCount = (await this.admissionModel.find({admissionStatus:admissionStatus.APPROVED})).length
            const facultyCount = (await this.facultyModel.find({isBlocked:false})).length
            const departmentCount = (await this.departmentModel.find()).length
            const batchCount = (await this.batchModel.find()).length
            return {studentCount,facultyCount,departmentCount,batchCount}
        } catch (error) {
            
        }
    }
    async createAdmission(admissionEnquiry: CreateAdmissionDto, userId: string): Promise<any> {
        try {
            const admissionId = this.generateAdmissionId();
            const admissionSave = await new this.admissionModel({ ...admissionEnquiry, admissionId }).save();
            if (admissionSave) {
                return await this.studentModel.findOneAndUpdate(
                    { _id: new Types.ObjectId(userId) },
                    {
                        $set: {
                            admssionDetails: admissionSave._id,
                        },
                    }
                );

            }
        } catch (error) {
            throw new HttpException('Failed to create admission', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    generateAdmissionId(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

    async createUser(registerForm: RegisterDto): Promise<registerReturn> {
        try {
            const { fullName, email, password } = registerForm;
            const hashedPassword = await bcrypt.hash(password, 10);
            const existingStudent = await this.studentModel.findOne({ email });

            if (existingStudent) {
                if (existingStudent.isVerified) {
                    throw new ConflictException('User Already Registered');
                } else {
                    const studentDetails = await this.studentModel.findOneAndUpdate({ email }, {
                        email,
                        username: fullName,
                        password: hashedPassword,
                    });
                    const userId = await this.sendMail(existingStudent, registerForm);
                    return { userId: userId.userId };
                }
            } else {
                const student = new this.studentModel({
                    username: fullName,
                    email,
                    password: hashedPassword,
                });

                await student.save();
                let userId = await this.sendMail(student, registerForm);

                return { userId: userId.userId };
            }
        } catch (error) {
            throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async sendMail(studentDetails: student, registerForm: RegisterDto): Promise<registerReturn> {
        try {
            const chars = '0123456789';
            let otp: string = '';

            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                otp += chars[randomIndex];
            }

            const filePath = join(__dirname, '../common/emails/userEmailOtp.html');
            const htmlTemplate = readFileSync(filePath, 'utf8');
            const compiledTemplate = handlebars.compile(htmlTemplate);
            const dynamicData = {
                name: registerForm.fullName,
                otpNum: otp,
            };
            const htmlContent = compiledTemplate(dynamicData);


            await this.mailerService
                .sendMail({
                    to: studentDetails.email,
                    from: 'edulinkschoolofficial@gmail.com',
                    subject: 'Edulink Register OTP',
                    text: '',
                    html: htmlContent,
                })
                .then(async () => {
                    const userCheck = await this.otpModel.findOne({ userId: studentDetails._id });
                    const hashOtp = await bcrypt.hash(otp, 10);

                    if (userCheck) {
                        await this.otpModel.updateOne(
                            { userId: studentDetails._id },
                            {
                                otp: hashOtp,
                                createdAt: Date.now(),
                                expiresAt: Date.now() + 600000,
                            },
                        );
                    } else {
                        await new this.otpModel({
                            userId: studentDetails._id,
                            otp: hashOtp,
                            createdAt: Date.now(),
                            expiresAt: Date.now() + 600000,
                        }).save();
                    }
                });

            return { userId: studentDetails._id };
        } catch (error) {
            throw new HttpException('Failed to send OTP email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyOtp(otpDetails: optDto): Promise<boolean> {
        try {
            const { otp, userId } = otpDetails
            const otpData = await this.otpModel.findOne({ userId: new Types.ObjectId(userId) })
            const isMatch = await bcrypt.compare(otp, otpData.otp);
            if (isMatch) {
                await this.studentModel.updateOne({ _id: otpData.userId }, {
                    isVerified: true
                })
            }
            return isMatch;
        } catch (error) {
            throw new HttpException('Failed to verify OTP', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyLogin(details: loginDto): Promise<any> {
        try {
            const data = await this.studentModel.findOne({ email: { $regex: new RegExp(details.email, "i") } })
            if (data) {
                if (data.isVerified) {
                    const paylaod = { sub: data._id, email: data.email }
                    const token = await this.jwtService.signAsync(paylaod)
                    const verifyPass = await bcrypt.compare(details.password, data.password)
                    if (verifyPass) {
                        return { token: token, id: data._id, data: data }
                    }
                    else {
                        throw new UnauthorizedException("password")
                    }
                } else {
                    throw new UnauthorizedException("access")
                }
            } else {
                throw new UnauthorizedException("email")
            }
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async fetchUserDetails(userId: string) {
        try {
            const user = await this.studentModel
                .findById(userId)
                .populate({
                    path: 'admssionDetails',
                    populate: {
                        path: 'department'
                    },
                }).populate('department')
                .exec();
            return user;
        } catch (error) {
            throw new HttpException('Failed to fetch user details.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginWithGoogle(credential: string): Promise<any> {
        const client = new OAuth2Client('336368670492-fl6qf7khgck227vn7nrkhn7t6eg4fu4n.apps.googleusercontent.com');

        try {
            const ticket: LoginTicket = await client.verifyIdToken({
                idToken: credential,
                audience: '336368670492-fl6qf7khgck227vn7nrkhn7t6eg4fu4n.apps.googleusercontent.com',
            });

            const payload: TokenPayload | undefined = ticket.getPayload();
            if (!payload) {
                throw new BadRequestException('Invalid Google token');
            }

            let user = await this.studentModel.findOne({ email: payload.email })
            let data!: any;
            if (!user) {
                const student = new this.studentModel({
                    googleId: payload.sub,
                    username: payload.name,
                    email: payload.email,
                    isVerified: true
                });
                data = await student.save();
            } else {
                data = await this.studentModel.findOneAndUpdate({ email: payload.email }, {
                    $set: {
                        googleId: payload.sub,
                        isVerified: true
                    }
                })
            }

            const paylaod = { sub: data._id, email: data.email }
            const token = await this.jwtService.signAsync(paylaod)
            return { token: token, id: data._id, data: data }
        } catch (error) {
            throw new BadRequestException('Invalid Google token');
        }
    }

    async createCheckout(data: any) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'INR',
                            product_data: {
                                name: 'Total Fees',
                            },
                            unit_amount: data.amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: 'http://localhost:4200/student/fees',
                cancel_url: 'http://localhost:4200/student/fees',
                metadata: {
                    year: data.feeYear,
                    userId: data.userId,
                },
            });
            return { id: session.id }
        } catch (error) {
           throw new HttpException('Failed to create checkout session', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async handleWebhook(payload: any, signature: string) {
        try {
            // Verify the signature
            const event = this.stripe.webhooks.constructEvent(
                payload.toString(),
                signature,
                'whsec_5e373ea036e290ead9dfc698789d642521940e44a3fe6e9f50e09b3b51cf2d1e'
            );
            const saveFeePayment = async (session: any) => {
                let paymentDetails: feePaymentDetail = {
                    year: Number(session.metadata.year),
                    amountPaid: session.amount_total / 100,
                    paymentDate: new Date(),
                    transactionId: session.payment_intent
                }
                await this.studentModel.updateOne({ _id: session.metadata.userId }, {
                    $push: { feePayments: paymentDetails },
                }, { new: true })
            }

            const emailCustomerAboutFailedPayment = (session) => {
                // If Failed Send Email About Failed
            }
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session: any = event.data.object;
                    if (session.payment_status === 'paid') {
                        saveFeePayment(session);
                    }
                    break;
                }
                case 'checkout.session.async_payment_succeeded': {
                    const session = event.data.object;
                    saveFeePayment(session);
                    break;
                }
                case 'checkout.session.async_payment_failed': {
                    const session = event.data.object;
                    emailCustomerAboutFailedPayment(session);
                    break;
                }
            }
        } catch (error) {
            console.error('Error processing webhook:', error.message);
        }
        return 'success';
    }



    async createLeaveApplication(id:string,leaveForm:leaveApplicationDto){
        try{
            return await this.studentModel.findByIdAndUpdate(id,{
                $push:{leaveApplications:leaveForm}
            })
        }catch(error){
            throw new HttpException('Failed to create leave application', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteLeave(userId:string,leaveId:string){
        try {
            return await this.studentModel.findByIdAndUpdate(userId,{
                $pull:{leaveApplications:{ _id: leaveId }}
            })
        } catch (error) {
            throw new HttpException('Failed to delete leave', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async fetchAssignmentsByDepartment(studentId:string){
        try {
            const studentDetail = await this.studentModel.findById(studentId)
            if(!studentDetail){
                return
            }
            const haha =  await this.assignmentModel.find({department:studentDetail.department}).populate('facultyId department')
            console.log(haha);
            return haha
            
        } catch (error) {
             throw new HttpException('Failed to fetch assignments by department', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateFileSubmissions(data : fileSubmissionDto){
        try {
            const { fileUrl, studentId, assignmentId } = data;
            const assignment = await this.assignmentModel.findById(assignmentId);
            const studnetData = await this.studentModel.findById(studentId)
            if (!assignment) {
                return { success: false, message: 'Assignment not found' };
            }
            const submissionIndex = assignment.submissions.findIndex(submission => submission.studentId.toString() === studentId);

            if (submissionIndex === -1) {
                assignment.submissions.push({
                    studentId: studnetData._id,
                    fileUrl: [fileUrl],
                    grade: 0,
                    isGraded:false,
                    lastUpdated:new Date()
                });
            } else {
                assignment.submissions[submissionIndex].fileUrl.push(fileUrl);
            }
            await assignment.save();

            return { success: true, message: 'File URL updated successfully' };
        } catch (error) {
            return { success: false, message: 'An error occurred' };
        }
    }

    async deleteFileSubmissions(data: fileSubmissionDto) {
        try {
            const { fileUrl, studentId, assignmentId } = data;
            const assignment = await this.assignmentModel.findById(assignmentId);
            if (!assignment) {
                return { success: false, message: 'Assignment not found' };
            }
    
            const submissionIndex = assignment.submissions.findIndex(submission => submission.studentId.toString() === studentId);
    
            if (submissionIndex === -1) {
                return { success: false, message: 'Submission not found' };
            }
    
            const submission = assignment.submissions[submissionIndex];
            const fileUrlIndex = submission.fileUrl.indexOf(fileUrl);
    
            if (fileUrlIndex === -1) {
                return { success: false, message: 'File URL not found in submissions' };
            }
    
            submission.fileUrl.splice(fileUrlIndex, 1);
            await assignment.save();
    
            return { success: true, message: 'File URL deleted successfully' };
        } catch (error) {
            return { success: false, message: 'An error occurred' };
        }
    }
    async getCommunities(studentId:string){
        try {
            const department = await this.studentModel.findById(studentId);            
            if(!department){
                return
            }
            const communities =  await this.communityChatModel.findOne({departmentId:department.department}).populate({
                path: 'departmentId',
              }).populate({
                path: 'messages',
                populate: [
                    { path: 'studentSender' ,model:'students',populate:[{
                        path:'admssionDetails',
                        model:'admissionEnquiry'
                    }]},
                    { path: 'facultySender' ,model:'faculty'}
                ]
              });
            return communities;
        } catch (error) {
            console.log(error);
            
        }
    }
    
    async getGroups(studentId:string){
        try {
            const groups =  await this.groupChatModel.find({ studentParticipants: { $in: [studentId] } }).populate({
                path: 'messages',
                populate: [
                    { path: 'studentSender' ,model:'students',populate:[{
                        path:'admssionDetails',
                        model:'admissionEnquiry'
                    }]},
                    { path: 'facultySender' ,model:'faculty'}
                ]
              });
            return groups;
        } catch (error) {
            console.log(error);
            
        }
    }

    async getMessages(groupId:string,type:groupType){
        try {
            let messages = [];
            if(type == groupType.COMMUNITY){
                const community = await this.communityChatModel.findById(groupId).populate({
                    path: 'messages',
                    model:'messages',
                    populate: [
                        { path: 'studentSender' ,model:'students',populate:[{
                            path:'admssionDetails',
                            model:'admissionEnquiry'
                        }]},
                        { path: 'facultySender' ,model:'faculty'}
                    ]
                });
                messages = community.messages
            }else{
                const group = await this.groupChatModel.findById(groupId).populate({
                    path: 'messages',
                    populate: [
                        { path: 'studentSender' ,model:'students',populate:[{
                            path:'admssionDetails',
                            model:'admissionEnquiry'
                        }]},
                        { path: 'facultySender' ,model:'faculty'}
                    ]
                });
                messages = group.messages
            }
            return messages;
        } catch (error) {
            console.log(error);
        }
    }

    async getFacultiesAndStudentByDepartment(studentId:string){
        try{
            const studentDetails = await this.studentModel.findById(studentId)
            if(studentDetails){
                const studentList = await this.studentModel.find({department:studentDetails.department})
                const facultyList = await this.departmentModel.find({_id:studentDetails.department}).populate('HOD')
                .populate('professors')
                .exec();
                return {studentList,facultyList}
            }
        }catch(error){
            console.log(error);
            
        }
    }
    async addGroup(groupForm:createGroupDto){
        try{
            const groupCrete = new this.groupChatModel(groupForm)
            const groupAdded = await groupCrete.save()
            const addToCommunity = await this.communityChatModel.updateOne({_id:groupForm.communityId},{
                $push:{groups:groupAdded._id}
            })
            return addToCommunity;
        }catch(error){
            console.log(error);
        }
    }
}
