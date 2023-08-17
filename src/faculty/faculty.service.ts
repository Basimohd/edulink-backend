import { ConflictException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { faculty } from "models/faculty.schema";
import * as bcrypt from 'bcrypt'
import { loginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AttendanceDto } from "./dtos/attendance.dto";
import { student } from "models/student.schema";
import { department } from "models/department.schema";
import { AssignmentDto } from "./dtos/assingment.dto";
import { AssignmentStatus, assignment, assignmentDetailType } from "../common/interfaces/assignment.interface";


@Injectable()
export class FacultyService {
    constructor(
        @InjectModel('faculty') private readonly facultyModel: Model<faculty>,
        @InjectModel('students') private readonly studentsModel: Model<student>,
        @InjectModel('department') private readonly departmentModel: Model<department>,
        @InjectModel('assignment') private readonly assignmentModel: Model<assignment>,
        private jwtService: JwtService
    ) { }
    
    //Faculty Auth
    async setPassword(registerForm: RegisterDto): Promise<any> {
        try {
            const { token, password } = registerForm;
            const facultyJwt = await this.jwtService.verify(token) as {facultyId:string};
            const facultyId = facultyJwt.facultyId 
            const facultyFound = await this.facultyModel.findById(facultyId)
            if (facultyFound) {
                if (facultyFound.password) {
                    throw new ConflictException('Faculty already Registered');
                } else {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        const passwordAdded = await this.facultyModel.updateOne(
                            { _id: facultyId },
                            { $set: { password: hashedPassword } }
                        );
                        
                        return passwordAdded
                }
            } else {
                throw new ConflictException('Faculty ID Not Found');
            }
        } catch (error) {
            throw new ConflictException(error.message || 'Faculty registration failed');
        }

    }

    async verifyLogin(loginForm: loginDto): Promise<any> {
        try {
            const { email, password } = loginForm;

            const facultyFound = await this.facultyModel.findOne({
                email: email
            })
            if (facultyFound) {
                if (facultyFound.isBlocked == true) {
                    throw new ConflictException('You have been blocked by Admin');
                } else {
                    if (!facultyFound.password) {
                        throw new ConflictException('Your Account is not Registered');
                    } else if (facultyFound.email !== email) {
                        throw new ConflictException('Entered Email is not correct');
                    } else {
                        const passMatch = await bcrypt.compare(password, facultyFound.password);
                        if (!passMatch) {
                            throw new ConflictException('Entered Password is incorrect');

                        } else {
                            const paylaod = { sub: facultyFound._id, email: facultyFound.email }
                            const token = await this.jwtService.signAsync(paylaod)
                            return { token: token, id: facultyFound._id, data: facultyFound }
                        }
                    }
                }
            } else {
                throw new ConflictException('Faculty ID Not Found');
            }
        } catch (error) {
            throw new ConflictException(error.message || 'Login failed');
        }
    }

    // Attendance Management
    async updateAttendance(payload: AttendanceDto): Promise<any> {
        try {
            const { studentId, studentAtendance, selectedDate } = payload;

            const existingStudent = await this.studentsModel.findById(studentId);

            if (!existingStudent) {
                // Handle error, student not found
                return;
            }

            const attendanceDate = new Date(selectedDate);
            attendanceDate.setUTCHours(0, 0, 0, 0);

            const existingAttendanceIndex = existingStudent.attendance.findIndex(attendance =>
                this.areDatesEqual(attendance.date, attendanceDate)
            );

            if (existingAttendanceIndex !== -1) {
                existingStudent.attendance[existingAttendanceIndex].status = studentAtendance;
            } else {
                existingStudent.attendance.push({
                    date: attendanceDate,
                    status: studentAtendance
                });
            }

            await existingStudent.save();

        } catch (error) {
            throw new HttpException('Failed to update attendance', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Assignment Management
    async fetchAssignments(facultyId: string) {
        try {
            return await this.assignmentModel
                .find({ facultyId: facultyId })
                .populate('department')
                .populate({
                    path: 'submissions.studentId',
                    model: 'students',
                    populate: [
                        { path: 'batch', model: 'batch' },
                        { path: 'admssionDetails', model: 'admissionEnquiry' } 
                    ]
                });
        } catch (error) {
           throw new HttpException('Failed to fetch assignments', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }    

    async addAssignment(assignment: AssignmentDto, facultyId: string) {
        try {
            const newAssignmentData = {
                ...assignment,
                facultyId,
                status: AssignmentStatus.OPEN,
            };

            const createdAssignment = new this.assignmentModel(newAssignmentData);
            return createdAssignment.save();
        } catch (error) {
            throw new HttpException('Failed to add assignment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    fetchDepartmentByFaculty(facultyId: string) {
        try {
            return this.departmentModel.find({
                $or: [
                    { professors: { $in: [facultyId] } },
                    { HOD: facultyId }
                ]
            });
        } catch (error) {
            throw new HttpException('Failed to fetch departments', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateGrade(submissionId:string,grade:number) {
        try {

            const updatedSubmission = await this.assignmentModel.findOneAndUpdate(
                {
                    'submissions._id': submissionId
                },
                {
                    $set: {
                        'submissions.$.grade': grade,
                        'submissions.$.isGraded': true
                    }
                },
                { new: true } 
            )

            if (!updatedSubmission) {
                throw new Error('Assignment with submission not found');
            }   
            return updatedSubmission;
            
        } catch (error) {
            throw new HttpException('Failed to update grade', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    areDatesEqual(date1: Date, date2: Date): boolean {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setUTCHours(0, 0, 0, 0);
        d2.setUTCHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();
    }
}