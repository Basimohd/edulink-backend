import { Body, Controller, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors,Headers, Req, RawBodyRequest, Delete } from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";
import { Express, Response } from 'express';
import { diskStorage } from "multer";
import { UserService } from "./user.service";
import { CreateAdmissionDto } from "./dtos/admission.dto";
import { optDto } from "./dtos/otp.dto";
import { RegisterDto } from "./dtos/register.dto";
import { loginDto } from "./dtos/login.dto";
import { leaveApplicationDto } from "./dtos/leaveApplication.dto";
import { updateLeaveStatusDto } from "./dtos/updateLeaveStatus.dto";
import { fileSubmissionDto } from "./dtos/fileSubmission.dto";
import * as request from 'request';

@Controller('user')
export class UserController {
  constructor(private userService: UserService,) { }

  @Post('/webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    const payload = req.rawBody;
    return await this.userService.handleWebhook(payload, signature)
  }

  @Post('register')
  async createUser(@Body() registerForm:RegisterDto){
      return await this.userService.createUser(registerForm);
  }
  
  @Post('verifyOtp')
  async verifyOtp(@Body() otpDetails:optDto){
      return this.userService.verifyOtp(otpDetails)
  }

  @Post('login')
  async verifyLogin(@Body() details: loginDto) {
      return this.userService.verifyLogin(details)
  }

  @Post('admissionStatus')
  async fetchAdmissionStatus(@Body() details: loginDto) {
      return this.userService.verifyLogin(details)
  }

  @Post('checkout')
  async createCheckout(@Body() data: any) {
      return this.userService.createCheckout(data)
  }

  
  // Creating a new Admission Enquiry
  @Post('admission')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join("_") + "_" + Date.now() + "." + fileExtension;
        cb(null, newFileName);
      }
    })
  }))
  async createAdmission(@UploadedFile() file: Express.Multer.File,
    @Body() admissionDetails: CreateAdmissionDto,
    @Res() response: Response) {
      admissionDetails.profilePicture = file.filename
    try {
      const user = await this.userService.createAdmission(admissionDetails,admissionDetails.userId);
      response.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      response.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  }

  @Get(':id')
  fetchUserData(@Param('id') userId: string){
    return this.userService.fetchUserDetails(userId)
  }

  @Post('loginWithGoogle')
  async loginWithGoogle(@Body() body: { credential: string }): Promise<any> {
    const { credential } = body;
    return this.userService.loginWithGoogle(credential)
  }

  @Get('students/:facultyId')
  async fetchStudentsByDepartment(@Param('facultyId') facultyId: string){
    try {
      return await this.userService.fetchStudentsByDepartment(facultyId)
    } catch (error) {
      console.log(error);
    }
  }

  @Post('leaveApplication/:id')
  async createLeaveApplication(@Param('id') id : string,@Body() leaveForm:leaveApplicationDto){
      return await this.userService.createLeaveApplication(id,leaveForm);
  }

  @Delete('deleteLeave/:userId/:leaveId')
  async deleteLeave(@Param('userId') userId : string,@Param('leaveId') leaveId : string){
      return await this.userService.deleteLeave(userId,leaveId);
  }

  @Patch('updateLeave')
  async updateLeaveStatus(@Body() updateData : updateLeaveStatusDto){
      return await this.userService.updateLeaveStatus(updateData);
  }

  @Get('assignment/:studentId')
  async fetchAssignmentsByDepartment(@Param('studentId') studentId : string){
      return await this.userService.fetchAssignmentsByDepartment(studentId);
  }

  @Patch('assignment/upload-file')
  async updateFileSubmissions(@Body() data : fileSubmissionDto){
      return await this.userService.updateFileSubmissions(data);
  }

  @Delete('assignment/delete-file')
  async deleteFileSubmissions(@Body() data : fileSubmissionDto){
    console.log(data.fileUrl);
    
      return await this.userService.deleteFileSubmissions(data);
  }


}