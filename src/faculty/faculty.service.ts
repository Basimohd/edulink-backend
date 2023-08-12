import { ConflictException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { faculty } from "models/faculty.schema";
import * as bcrypt from 'bcrypt'
import { loginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AttendanceDto } from "./dtos/attendance.dto";
import { student } from "models/student.schema";
import { attendance, attendanceDetailType } from "common/interfaces/attendance.interface";


@Injectable()
export class FacultyService {
    constructor(
        @InjectModel('faculty') private readonly facultyModel: Model<faculty>,
        @InjectModel('students') private readonly studentsModel: Model<student>,
        private jwtService: JwtService
    ) { }

    async createFaculty(registerForm: RegisterDto): Promise<any> {
        try {
            const { facultyID, firstName, lastName, email, password } = registerForm;
            
            const facultyFound = await this.facultyModel.findOne({
                facultyId: facultyID
            })
            if (facultyFound) {
                if (facultyFound.password) {
                    throw new ConflictException('Faculty already Registered');
                } else {
                    if (facultyFound.email == email) {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        const passwordAdded = await this.facultyModel.findOneAndUpdate(
                            { facultyId:facultyID },
                            { $set: { password: hashedPassword } }
                        );
                        return passwordAdded
                    } else {
                        throw new ConflictException('Email Not Match');
                    }
                }
            } else {
                throw new ConflictException('Faculty ID Not Found');
            }
        } catch (error) {
            throw new ConflictException(error);
        }

    }
    async verifyLogin(loginForm: loginDto): Promise<any> {
        try {
            const { facultyID,email,password } = loginForm;
            
            const facultyFound = await this.facultyModel.findOne({
                facultyId: facultyID
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
            throw new ConflictException(error);
        }
    }
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
    
            await existingStudent.save(); // Save the updated student
            
        } catch (error) {
            console.log(error);
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