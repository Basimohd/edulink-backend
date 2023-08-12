import { Body, Controller, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";

import { Express, Response } from 'express';
import { AdminService } from "./admin.service";
import { loginDto } from "./dtos/login.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { facultyDto } from "./dtos/faculty.dto";
import { departmentDto } from "./dtos/department.dto";
import { batchDto } from "./dtos/batch.dto";
import { AdmissionUpdateDto } from "./dtos/admissionUpdate.dto";
import { UpdateFacultyDto } from "./dtos/upadateFaculty.dto";

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService,) { }

  //Admin Authentication
  @Post('login')
  async verifyLogin(@Body() details: loginDto) {
    return this.adminService.verifyLogin(details)
  }

  //Admission Management
  @Get('admissions')
  async fetchAdmissionEnquiries(@Res() response: Response) {
    const user = await this.adminService.fetchAllAdmissions();
    response.json(user)
  }

  @Patch('admission/:id/status')
  async updateAdmissionStatus(@Param('id') id: string, @Body() admissionUpdateDto: AdmissionUpdateDto) {
    return await this.adminService.updateAdmissionStatus(id, admissionUpdateDto)
  }

  //Faculty Management
  @Get('faculties')
  async fetchFaculties() {
    const faculties = await this.adminService.fetchAllFaculties();
    return { faculties }
  }

  @Post('add-faculty')
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
  async addFaculty(
    @UploadedFile() file: Express.Multer.File,
    @Body() facultyDetails: facultyDto) {
    facultyDetails.profilePicture = file.filename
    return await this.adminService.addFaculty(facultyDetails);
  }



  @Patch('update-faculty')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join("_") + "_" + Date.now() + "." + fileExtension;
        cb(null, newFileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }))
  async updateFaculty(
    @UploadedFile() file: Express.Multer.File,
    @Body() facultyDetails: UpdateFacultyDto
  ) {
    try {
      if (file) {
        facultyDetails.profilePicture = file.filename;
      }
      return await this.adminService.updateFaculty(facultyDetails);
    } catch (error) {
      console.log(error);
    }
  }

  //Department Management
  @Get('departments')
  async fetchDepartments() {
    const departments = await this.adminService.fetchAllDepartments();
    return { departments }
  }

  @Post('add-department')
  async addDepartment(@Body() departmentDetails: departmentDto) {
    return await this.adminService.addDepartment(departmentDetails);

  }

  @Patch('update-department')
  async updateDepartment(@Body() departmentDetails: departmentDto) {
    return await this.adminService.updateDepartment(departmentDetails);

  }


  //Batch Management
  @Get('batches')
  async fetchBatches() {
    const batches = await this.adminService.fetchAllBatches();
    return { batches }
  }

  @Get('batch/:departmentId')
  async fetchBatchesByDepartment(@Param('departmentId') departmentId: string) {
    const batches = await this.adminService.fetchBatchesByDepartment(departmentId);
    return { batches }
  }

  @Post('add-batch')
  async addBatch(@Body() batchDetails: batchDto) {
    return await this.adminService.addBatch(batchDetails);
  }

  @Patch('update-batch')
  async updateBatch(@Body() batchDetails: batchDto) {
    return await this.adminService.updateBatch(batchDetails);
  }

}