using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Models{
    public class DBmanager
    {
        private readonly string connString = "server=localhost;port=3306;user id=zhiyun;password=abcd123456789;database=hospitalscheduling;charset=utf8;";
        //取得科別醫生列表(設定班數)
        public List<Doctor> GetDoctors(string subdepartment) {
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,department_name FROM `doctors` INNER JOIN `department` ON (doctors.doctor_department_id=department.department_id)  WHERE (department_name=@subdepartment)");
            sqlCommand.Parameters.AddWithValue("@subdepartment", subdepartment);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        Doctor_ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
                        Doctor_Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        Doctor_Department  = reader.GetString(reader.GetOrdinal("department_name")),
                    };
                    doctors.Add(doctor);
                }
            }
            else {
                Console.WriteLine("資料庫為空！");
            }
            sqlConnection.Close();
            return doctors;

        }
        //取得當月醫生班數(暫定班表頁面)
        public List<Doctor> GetShift(int year,int month,string subdepartment) {
            // DateTime dtNow = DateTime.Now;
            // string department = "一般內科";
            // int currentMonth = dtNow.Month;
            // int currentYear = dtNow.Year;
            // int nextMonth;
            // int nextYear=0;
            // if(currentMonth==12){
            //     nextMonth = 1;
            //     nextYear = currentYear+1;
            // }else{
            //     nextMonth = currentMonth+1;
            // }
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
        //    SELECT doctor_id,doctor_name,shift_weekdays FROM `doctors` INNER JOIN `shift` INNER JOIN `department`ON (doctors.doctor_id=shift.shift_doctor_id) WHERE(department_name="一般內科")&&(shift_month=3)&&(shift_year=2024);

            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,shift_weekdays FROM `doctors` INNER JOIN `shift` ON (doctors.doctor_id=shift.shift_doctor_id) INNER JOIN `department` ON (doctors.doctor_department_id=department.department_id) WHERE(department_name=@department)&&(shift_month=@month)&&(shift_year=@year);");
            sqlCommand.Parameters.AddWithValue("@month", month);
             sqlCommand.Parameters.AddWithValue("@year", year);
              sqlCommand.Parameters.AddWithValue("@department", subdepartment);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        Doctor_ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
                        Doctor_Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        Shift  = reader.GetInt16(reader.GetOrdinal("shift_weekdays")),
                    };
                    doctors.Add(doctor);
                }
            }
            else {
                Console.WriteLine("資料庫為空！");
            }
            sqlConnection.Close();
            return doctors;

        }
       
        //新增班數(存不了?)
        public void NewShift(List<Setting> worktimeData,String ward)
        {
            DateTime dtNow = DateTime.Now;
            int currentMonth = dtNow.Month;
            int currentYear = dtNow.Year;
            int nextMonth;
            int nextYear=0;
            if(currentMonth==12){
                nextMonth = 1;
                nextYear = currentYear+1;
            }else{
                nextMonth = currentMonth+1;
            }
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (worktimeData !=null){
                try{
                     Console.WriteLine(worktimeData.Count);
                    foreach (Setting setting in worktimeData)
                    {
                        MySqlCommand sqlCommand = new MySqlCommand("INSERT INTO `shift` (shift_doctor_id,shift_ward_id, shift_department_id,shift_month,shift_year,shift_weekdays,shift_holiday) VALUES (@doctorId,1,1,@month,@year,@shift,0)", sqlConnection);
                        sqlCommand.Parameters.AddWithValue("@doctorId", setting.Setting_Doctor_ID);
                        sqlCommand.Parameters.AddWithValue("@shift", setting.Shift);
                        sqlCommand.Parameters.AddWithValue("@month", nextMonth);
                        sqlCommand.Parameters.AddWithValue("@year", nextYear);
                        sqlCommand.Parameters.AddWithValue("@ward", ward);
                        Console.WriteLine("WorktimeData succesfully saved to the database");                  
                        sqlCommand.ExecuteNonQuery();
                    }
                }catch(Exception e)
                {
                    Console.WriteLine("Error: " + e.ToString());
                }
            }else{
                Console.WriteLine("No worktimeData succesfully saved to the database");
            }
            sqlConnection.Close();
        }
        
        //Doctor/Scheduling新增醫生不上班日期
        public void NewUnfavDate(List<DateTime> dates)
        {
            int doctor_id=1;
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (dates !=null){
                try{
                    // Console.WriteLine(date.Count);
                    foreach (DateTime date in dates)
                    {
                        MySqlCommand sqlCommand = new MySqlCommand("insert into `unfav_date` (unfav_date,unfav_date_doctor_id) VALUES( ?,?);", sqlConnection);
                        sqlCommand.Parameters.AddWithValue("@date",date); 
                        sqlCommand.Parameters.AddWithValue("@doctor_id",doctor_id );
                        sqlCommand.ExecuteNonQuery();
                    }
                }catch(Exception e)
                {
                    Console.WriteLine("Error: " + e.ToString());
                }
            }else{
                Console.WriteLine("儲存醫生不上班日期失敗");
            }
            sqlConnection.Close();
        }
        //取得班表
        public List<Schedule> GetSchedule(int year,int month,string subdepartment) {
            List<Schedule> schedules = new List<Schedule>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand
            // SELECT schedule_id,schedule_date,doctor_name FROM `schedule` INNER JOIN `doctors`  ON (doctors.doctor_id=schedule.schedule_doctor_id)  WHERE year(schedule_date)=2023 and month(schedule_date)=12 and department_name="一般內科";
            ("SELECT schedule_id,schedule_date,doctor_name FROM `schedule` INNER JOIN `doctors` ON (doctors.doctor_id=schedule.schedule_doctor_id) INNER JOIN `department` ON (department.department_id=schedule.schedule_department_id) WHERE year(schedule_date)=@year and month(schedule_date)=@month and department_name=@department");
            sqlCommand.Parameters.AddWithValue("@year", year);
            sqlCommand.Parameters.AddWithValue("@month",month);
            sqlCommand.Parameters.AddWithValue("@department",subdepartment);
            sqlCommand.Connection = sqlConnection;
            // SELECT schedule_date,doctor_name FROM `schedule` INNER JOIN `doctors` ON (doctors.doctor_id=schedule.schedule_doctor_id) WHERE year(schedule_date)=2023 and month(schedule_date)=11;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Schedule schedule = new Schedule {
                        Schedule_id  = reader.GetInt16(reader.GetOrdinal("schedule_id")),
                        Schedule_date = reader.GetDateTime(reader.GetOrdinal("schedule_date")).Date,
                        Schedule_doctor_name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        // Schedule_department_id  = reader.GetString(reader.GetOrdinal("schedule_department_id")),
                    };
                    schedules.Add(schedule);
                    
                }
            }
            else {
                Console.WriteLine("資料庫為空！");
            }
            sqlConnection.Close();
            return schedules;

        }
        //取得醫生電話
        // public List<Doctor> GetDoctorPhone() {
        //     List<Doctor> doctors = new List<Doctor>();
        //     MySqlConnection sqlConnection = new MySqlConnection(connString);
        //     MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,doctor_phone,doctor_department FROM `doctors`ORDER BY doctor_department");
        //     sqlCommand.Connection = sqlConnection;
        //     sqlConnection.Open();
        //     MySqlDataReader reader = sqlCommand.ExecuteReader();
        //     if (reader.HasRows) {
        //         while (reader.Read()) {
        //             Doctor doctor = new Doctor {
        //                 ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
        //                 Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
        //                 Department  = reader.GetString(reader.GetOrdinal("doctor_department")),
        //                 Doctor_Phone  = reader.GetString(reader.GetOrdinal("doctor_phone")),
        //             };
        //             doctors.Add(doctor);
        //         }
        //     }
        //     else {
        //         Console.WriteLine("資料庫為空！");
        //     }
        //     sqlConnection.Close();
        //     return doctors;

        // }
        // 登入驗證_管理者
        public bool CheckManagerData(string ManagerUsername,string ManagerPassword){
            // try{
            //    MySqlConnection sqlConnection = new MySqlConnection(connString);
            //    sqlConnection.Open(); 
            // }
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT * FROM `managers` WHERE `manager_account`='" + ManagerUsername +"' AND `manager_password` = '" +ManagerPassword +"';");
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                sqlConnection.Close();
                return true;
            }
            else {
                sqlConnection.Close();
                return false;
            }
        }
        // 登入驗證_醫生
        public bool CheckDoctorData(string DoctorUsername,string DoctorPassword){
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_name FROM `doctors` WHERE `doctor_account`='" + DoctorUsername +"' AND `doctor_password` = '" +DoctorPassword +"';");
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                // String Name=reader.GetString(reader.GetOrdinal("doctor_name"));
                sqlConnection.Close();
                return true;
            }
            else {
                sqlConnection.Close();    
                return false;
            
            }
            
        }
        //讀取暫定班表的排班員工
        public List<Schedule> GetNextSchedule(String DepartmentName) {
            List<Schedule> schedules = new List<Schedule>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT schedule_id,schedule_date,doctor_name FROM `schedule` INNER JOIN `doctors` ON (doctors.doctor_id=schedule.schedule_doctor_id)");
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Schedule schedule = new Schedule {
                        Schedule_id  = reader.GetInt16(reader.GetOrdinal("schedule_id")),
                        Schedule_date = reader.GetDateTime(reader.GetOrdinal("schedule_date")).Date,
                        Schedule_doctor_name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                    };
                    schedules.Add(schedule);
                }
            }
            else {
                Console.WriteLine("資料庫為空！");
            }
            sqlConnection.Close();
            return schedules;

        }
        public int GetUserId(string username) {
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id FROM `doctors` WHERE doctor_account=@username;");
            sqlCommand.Parameters.AddWithValue("@username", username);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.Read())
            {
                int UserId  = reader.GetInt32(reader.GetOrdinal("doctor_id"));
                Console.WriteLine(UserId);
                sqlConnection.Close();
                return UserId;
                // 其他處理
            }
            else
            {
                // 處理沒有找到資料的情況
                Console.WriteLine(0);
                return 0;
            }
        }
        public Doctor GetInformation(int userId) {
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_name,department_name FROM `doctors` inner join `department`ON (doctors.doctor_department_id=department.department_id) WHERE doctor_id=@userId;");
            sqlCommand.Parameters.AddWithValue("@userId", userId);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.Read())
            {
                Doctor doctor = new Doctor {
                Doctor_Name = reader.GetString(reader.GetOrdinal("doctor_name")),
                Doctor_Department = reader.GetString(reader.GetOrdinal("department_name"))
                };
                // string UserName = reader.GetString(reader.GetOrdinal("doctor_name"));
                sqlConnection.Close();
                return doctor;
                // 其他處理
            }
            else
            {
                Doctor doctor = new Doctor {
                    Doctor_Name = "沒搜尋到"
                };
                // 處理沒有找到資料的情況
                Console.WriteLine(0);
                return doctor ;
            }
        }
    }
}
