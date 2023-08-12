
import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { admissionStatus } from './enums/admissionStatus.enum';
import { Admission } from 'models/admission.schema';
import { loginDto } from './dtos/login.dto';
import { admin } from '../models/admin.schema';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { facultyDto } from './dtos/faculty.dto';
import { faculty } from 'models/faculty.schema';
import { join } from 'path';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import { MailerService } from '@nestjs-modules/mailer';
import { departmentDto } from './dtos/department.dto';
import { department } from 'models/department.schema';
import { batchDto } from './dtos/batch.dto';
import { batch } from 'models/batch.schema';
import { AdmissionUpdateDto } from './dtos/admissionUpdate.dto';
import { student } from 'models/student.schema';
import { UpdateFacultyDto } from './dtos/upadateFaculty.dto';

@Injectable()
export class AdminService {

  constructor(
    @InjectModel('admissionEnquiry') private readonly admissionModel: Model<Admission>,
    @InjectModel('admins') private readonly adminModel: Model<admin>,
    @InjectModel('faculty') private readonly facultyModel: Model<faculty>,
    @InjectModel('department') private readonly departmentModel: Model<department>,
    @InjectModel('batch') private readonly batchModel: Model<batch>,
    @InjectModel('students') private readonly studentModel: Model<student>,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) { }

  //Admim Authentication
  async verifyLogin(details: loginDto): Promise<any> {
    try {
      const data = await this.adminModel.findOne({ email: details.email })
      if (data) {

        const verifyPass = await bcrypt.compare(details.password, data.password)
        if (verifyPass) {
          const paylaod = { sub: data._id, email: data.email }
          const token = await this.jwtService.signAsync(paylaod)
          return { token: token, id: data._id, data: data }
        }
        else {
          throw new UnauthorizedException("password")
        }
      } else {
        throw new UnauthorizedException("email")
      }
    } catch (error) {
      console.log(error)
    }
  }


  //Admission Management
  async fetchAllAdmissions() {
    try {
      const admissions = await this.admissionModel.find().populate('department').exec()
      return admissions;
    } catch (error) {
      console.log(error)
      throw new HttpException('Failed to fetch Admission Enquiries', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAdmissionStatus(id: string, admDetails: AdmissionUpdateDto) {
    try {
      const updateAdmissionStatus = await this.admissionModel.updateOne({ _id: id }, {
        $set: {
          admissionStatus: admDetails.status
        }
      })
      return await this.studentModel.updateOne({ admssionDetails: new Types.ObjectId(id) }, {
        $set: {
          department: new Types.ObjectId(admDetails.departmentBatch.department),
          batch: new Types.ObjectId(admDetails.departmentBatch.batch)
        }
      }, { new: true })
    } catch (error) {
      console.log(error);

    }
  }

  //Faculty Management
  async fetchAllFaculties() {
    try {
      return this.facultyModel.find()
    } catch (error) {
      throw new HttpException('Failed to fetch faculties', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addFaculty(facultyDetails: facultyDto) {
    try {
      const { facultyName, phoneNumber, email, mainSubject, profilePicture } = facultyDetails;
      const existingFaculty = await this.facultyModel.findOne({ email });
      if (existingFaculty) {
        throw new ConflictException('Faculty with this Email Already Registered');
      } else {
        const min = 10000;
        const max = 99999;
        const randomID = Math.floor(Math.random() * (max - min + 1)) + min;
        const faculty = new this.facultyModel({
          facultyId: randomID,
          facultyName,
          phoneNumber,
          email,
          mainSubject,
          profilePicture
        });
        await faculty.save();
        let facultyId = await this.sendMail(faculty);
        return { facultyId: facultyId.facultyId };
      }
    } catch (error) {
      console.log(error)
    }
  }
  async updateFaculty(facultyDetails: UpdateFacultyDto) {
    try {
      const { facultyId, facultyName, phoneNumber, email, mainSubject, profilePicture } = facultyDetails;
      const existingFaculty = await this.facultyModel.findOne({
        email: email,
        _id: { $ne: facultyId }
      });

      if (existingFaculty) {
        throw new ConflictException('Faculty with this Email Already Registered');
      } else {
        const updateFaculty = await this.facultyModel.updateOne({ _id: new Types.ObjectId(facultyId) }, {
          $set: {
            facultyName,
            phoneNumber,
            email,
            mainSubject,
            profilePicture
          }
        })
        return { facultyId: updateFaculty };
      }
    } catch (error) {
      console.log(error)
    }
  }

  //Department Management
  async fetchAllDepartments() {
    try {
      return this.departmentModel.find().populate('professors HOD').exec()
    } catch (error) {
      throw new HttpException('Failed to fetch faculties', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addDepartment(departmentDetails: departmentDto) {
    try {
      const department = await new this.departmentModel(departmentDetails).save();
      return department
    } catch (error) {

    }
  }
  async updateDepartment(departmentDetails: departmentDto) {
    try {
      const { departmentName,description,HOD,duration,fees,professors} = departmentDetails
      const department = await this.departmentModel.updateOne({_id: new Types.ObjectId(departmentDetails.departmentID)},{
        $set:{ departmentName,description,HOD,duration,fees,professors}
      })
      return department
    } catch (error) {
      
    }
  }

  //Batch Management
  async fetchBatchesByDepartment(departmentId: string) {
    try {
      console.log(departmentId)
      const batches = await this.batchModel.find({ department: departmentId })
      return batches;
    } catch (error) {
      throw new HttpException('Failed to fetch Batches', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async fetchAllBatches() {
    try {
      return this.batchModel.find().populate('department tutor').exec()
    } catch (error) {
      throw new HttpException('Failed to fetch faculties', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async addBatch(batchDetails: batchDto) {
    try {
      const batch = await new this.batchModel(batchDetails).save();
      return batch;
    } catch (error) {
      console.log(error)
    }
  }
  async updateBatch(batchDetails: batchDto) {
    try {
      const {batchId,department,batch,tutor,maxSeats} = batchDetails
      const updateBatch = await this.batchModel.updateOne({_id:new Types.ObjectId(batchId)},{
        $set:{
          department,
          batch,
          tutor,
          maxSeats
        }
      })
      return updateBatch;
    } catch (error) {
      console.log(error)
    }
  }

  //Mail Services
  async sendMail(facultyDetails: faculty): Promise<any> {
    const filePath = join(__dirname, '../common/emails/facultyIdEmail.html');
    const htmlTemplate = readFileSync(filePath, 'utf8');
    const compiledTemplate = handlebars.compile(htmlTemplate);
    const dynamicData = {
      name: facultyDetails.facultyName,
      registerId: facultyDetails.facultyId,
    };
    const htmlContent = compiledTemplate(dynamicData);


    await this.mailerService
      .sendMail({
        to: facultyDetails.email,
        from: 'edulinkschoolofficial@gmail.com',
        subject: 'Edulink Register ID',
        text: '',
        html: htmlContent,
      })

    return { facultyId: facultyDetails._id };
  }

}

