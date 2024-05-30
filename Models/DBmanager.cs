using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Models{
    public class DBmanager
    {

        // 管理者：取得科別醫生列表
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
        // 管理者取得當月醫生班數(暫定班表頁面)
        public List<Doctor> GetShift(int year,int month,string subdepartment) {
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            //    SELECT doctor_id,doctor_name,shift_weekdays FROM `doctors` INNER JOIN `shift` INNER JOIN `department`ON (doctors.doctor_id=shift.shift_doctor_id) WHERE(department_name="一般內科")&&(shift_month=3)&&(shift_year=2024);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_phone,doctor_name,shift_weekdays,shift_state FROM `doctors` INNER JOIN `shift` ON (doctors.doctor_id=shift.shift_doctor_id) INNER JOIN `department` ON (doctors.doctor_department_id=department.department_id) WHERE(department_name=@department)&&(shift_month=@month)&&(shift_year=@year);");
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
                        Doctor_Phone  = !reader.IsDBNull(reader.GetOrdinal("doctor_phone")) ? reader.GetString(reader.GetOrdinal("doctor_phone")) : "無" ,
                        Shift  = !reader.IsDBNull(reader.GetOrdinal("doctor_phone")) ? reader.GetInt16(reader.GetOrdinal("shift_weekdays")) : 0,
                        Doctor_State  = !reader.IsDBNull(reader.GetOrdinal("shift_state")) && reader.GetBoolean(reader.GetOrdinal("shift_state"))
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
        public void NewSchedule(List<Schedule> schedules,string subdepartment)
        {
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (schedules !=null){
                try{
                    //  Console.WriteLine(worktimeData.Count);
                    foreach (Schedule schedule in schedules)
                    {
                        MySqlCommand sqlCommand = new MySqlCommand("INSERT INTO `schedule` (schedule_doctor_id,schedule_date,schedule_department_id,schedule_ward_id) VALUES (@schedule_doctor_id,@schedule_date,(SELECT department_id FROM `department` WHERE department_name=@subdepartment),1)", sqlConnection);
                        sqlCommand.Parameters.AddWithValue("@schedule_doctor_id", schedule.Schedule_doctor_id);
                        sqlCommand.Parameters.AddWithValue("@schedule_date", schedule.Schedule_date);
                        sqlCommand.Parameters.AddWithValue("@subdepartment", subdepartment);

                        
                        Console.WriteLine("WorktimeData succesfully saved to the database");                  
                        sqlCommand.ExecuteNonQuery();
                    }
                }catch(Exception e)
                {
                    Console.WriteLine("Error: " + e.ToString());
                }
            }else{
                Console.WriteLine("No schedule succesfully saved to the database");
            }
            sqlConnection.Close();
        }
        // 管理者：新增班數
        public void NewShift(List<Doctor> doctors)
        {
            // DateTime dtNow = DateTime.Now;
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
            var currentDate = DateTime.Now; //現在時間
            var twoMonthsLater = currentDate.AddMonths(2); //兩個月後
            int year = twoMonthsLater.Year; //兩個月後年
            int month = twoMonthsLater.Month; //兩個月後月

            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (doctors !=null){
                try{
                    //  Console.WriteLine(worktimeData.Count);
                    foreach (Doctor doctor in doctors)
                    {
                        MySqlCommand sqlCommand = new MySqlCommand("INSERT INTO `shift` (shift_doctor_id,shift_ward_id, shift_department_id,shift_year,shift_month,shift_weekdays,shift_holiday) VALUES ((SELECT doctor_id FROM `doctors` WHERE doctor_name=@doctorname),1,(SELECT department_id FROM `department` WHERE department_name=@subdepartment),@year,@month,@shift,0);", sqlConnection);
                        sqlCommand.Parameters.AddWithValue("@doctorname", doctor.Doctor_Name);
                        sqlCommand.Parameters.AddWithValue("@shift", doctor.Shift);
                        sqlCommand.Parameters.AddWithValue("@month", month);
                        sqlCommand.Parameters.AddWithValue("@year", year);
                        sqlCommand.Parameters.AddWithValue("@subdepartment", doctor.Doctor_Department);
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
        // 醫生：新增醫生不上班日期
        public void NewUnfavDate(List<DateTime> dates,int doctorId)
        {
            // int doctor_id=1;
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (dates !=null){
                try{
                    // Console.WriteLine(date.Count);
                    foreach (DateTime date in dates)
                    {
                        MySqlCommand sqlCommand = new MySqlCommand("insert into `unfav_date` (unfav_date,unfav_date_doctor_id) VALUES( @date,@doctor_id);", sqlConnection);
                        sqlCommand.Parameters.AddWithValue("@date",date); 
                        sqlCommand.Parameters.AddWithValue("@doctor_id",doctorId);
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
        // 管理者：取得班表
        public List<Schedule> GetSchedule(int year,int month,string subdepartment) {
            List<Schedule> schedules = new List<Schedule>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand
            // SELECT schedule_id,schedule_date,doctor_name FROM `schedule` INNER JOIN `doctors`  ON (doctors.doctor_id=schedule.schedule_doctor_id)  WHERE year(schedule_date)=2023 and month(schedule_date)=12 and department_name="一般內科";
            ("SELECT schedule_id,schedule_date,doctor_name,doctor_color FROM `schedule` INNER JOIN `doctors` ON (doctors.doctor_id=schedule.schedule_doctor_id) INNER JOIN `department` ON (department.department_id=schedule.schedule_department_id) WHERE year(schedule_date)=@year and month(schedule_date)=@month and department_name=@department");
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
                        Schedule_doctor_color = reader.GetInt16(reader.GetOrdinal("doctor_color"))
                        // Schedule_doctor_color = !reader.IsDBNull(reader.GetOrdinal("doctor_color")) ? reader.GetInt16(reader.GetOrdinal("doctor_color")) : 0
                        
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
        
        // 登入驗證_管理者
        public bool CheckManagerData(string ManagerUsername,string ManagerPassword){
            // try{
            //    MySqlConnection sqlConnection = new MySqlConnection(connString);
            //    sqlConnection.Open(); 
            // }
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT * FROM `managers` WHERE `manager_account`= @ManagerUsername AND `manager_password` =@ManagerPassword;");
            sqlCommand.Connection = sqlConnection;
            sqlCommand.Parameters.AddWithValue("@ManagerUsername", ManagerUsername);
            sqlCommand.Parameters.AddWithValue("@ManagerPassword", ManagerPassword);
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
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_name FROM `doctors` WHERE `doctor_account`=@DoctorUsername AND `doctor_password` =@DoctorPassword;");
            sqlCommand.Parameters.AddWithValue("@DoctorUsername", DoctorUsername);
            sqlCommand.Parameters.AddWithValue("@DoctorPassword", DoctorPassword);
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
        // 管理者：讀取暫定班表的排班員工??
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
        // 醫生：透過帳號取得醫生ID
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
        // 醫生：取的醫生基本資料顯示在頁面上
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
        // 管理者：取得醫生確認班表情況
        public bool GetDoctorState(int userId) {
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT shift_state FROM `shift` WHERE shift_month=7 AND shift_year=2024 AND shift_doctor_id=@userId;");
            sqlCommand.Parameters.AddWithValue("@userId", userId);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.Read())
            {   
                bool doctor_state=reader.GetBoolean(reader.GetOrdinal("shift_state"));
                return doctor_state;
            }
            else
            {
                sqlConnection.Close();
                return false;
            }
        }
        // 管理者：編輯班表?
        public void UpdateSchedule(List<Schedule> schedules){
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (schedules !=null){
                try{
                    foreach (Schedule schedule in schedules)
                    {
                        Console.WriteLine(schedule.Schedule_doctor_name);
                        Console.WriteLine(schedule.Schedule_day);
                        DateTime dateTime = new DateTime(2024,7,schedule.Schedule_day);
                        MySqlCommand sqlCommand = new MySqlCommand(
                            "UPDATE `schedule` SET schedule_doctor_id = (SELECT doctor_id FROM `doctors` WHERE doctors.doctor_name=@doctorName) WHERE schedule_date = @date AND schedule_department_id = (SELECT department_id FROM `department` WHERE department.department_name=@departmentId);", 
                            sqlConnection
                        );
                        sqlCommand.Parameters.AddWithValue("@doctorName", schedule.Schedule_doctor_name);
                        sqlCommand.Parameters.AddWithValue("@date", dateTime);
                        sqlCommand.Parameters.AddWithValue("@departmentId", schedule.Schedule_department_name);
                        // Console.WriteLine("WorktimeData succesfully updated to the database");                  
                        sqlCommand.ExecuteNonQuery();
                    }
                }catch(Exception e)
                {
                    Console.WriteLine("Error: " + e.ToString());
                }   
            }
            sqlConnection.Close();
        }
        // 醫生：更新班表確認狀況
        public void UpdateState(int doctorId){
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            sqlConnection.Open();
            if (doctorId !=null){
                try{
                    MySqlCommand sqlCommand = new MySqlCommand(
                        "UPDATE `shift` SET shift_state = true WHERE shift_doctor_id=@doctorId AND shift_year = 2024 AND shift_month=7 ;", 
                        sqlConnection
                    );
                    sqlCommand.Parameters.AddWithValue("@doctorId", doctorId);
                    // sqlCommand.Parameters.AddWithValue("@year", year);
                    // sqlCommand.Parameters.AddWithValue("@month", month);
                    // Console.WriteLine("WorktimeData succesfully updated to the database");                  
                    sqlCommand.ExecuteNonQuery();
                    
                }catch(Exception e)
                {
                    Console.WriteLine("Error: " + e.ToString());
                }   
            }
            sqlConnection.Close();
        }
        // 管理者：檢查已排班/未排班科別
        public bool CheckSchedulingCompleted(int department){
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT * from `schedule` WHERE  schedule_department_id=@departmentId AND MONTH(schedule_date) = 7 AND YEAR(schedule_date) = 2024;");
            sqlCommand.Parameters.AddWithValue("@departmentId", department);
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

        // 醫生：取得醫生不想上班日期
        public List<DateTime> GetUnfavDate(int doctorId,int month,int year) {
            List<DateTime> unfav_dates = new List<DateTime>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT unfav_date from `unfav_date` WHERE  unfav_date_doctor_id=@doctorId AND MONTH(unfav_date) = @month AND YEAR(unfav_date) = @year;");
            sqlCommand.Parameters.AddWithValue("@doctorId", doctorId);
            sqlCommand.Parameters.AddWithValue("@month", month);
            sqlCommand.Parameters.AddWithValue("@year", year);
            sqlCommand.Connection = sqlConnection;
            // Console.WriteLine("doctorId"+doctorId);
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                DateTime unfav_date;
                while (reader.Read()) {
                    unfav_date= reader.GetDateTime(reader.GetOrdinal("unfav_date")).Date;
                    unfav_dates.Add(unfav_date);
                }
                return unfav_dates;
            }
            else {
                Console.WriteLine("GetUnfavDate：資料庫為空！");
            }
            sqlConnection.Close();
            return unfav_dates;

        }
        // 管理者：取得醫生不想上班日期
        public List<DateTime> MangerGetUnfavDate(string doctorname,int month,int year) {
            List<DateTime> unfav_dates = new List<DateTime>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT unfav_date from `unfav_date` WHERE  unfav_date_doctor_id=( SELECT doctor_id FROM `doctors`WHERE doctor_name=@doctorname) AND MONTH(unfav_date) = @month AND YEAR(unfav_date) = @year;");
            sqlCommand.Parameters.AddWithValue("@doctorname", doctorname);
            sqlCommand.Parameters.AddWithValue("@month", month);
            sqlCommand.Parameters.AddWithValue("@year", year);
            sqlCommand.Connection = sqlConnection;
            // Console.WriteLine("doctorId"+doctorId);
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                DateTime unfav_date;
                while (reader.Read()) {
                    unfav_date= reader.GetDateTime(reader.GetOrdinal("unfav_date")).Date;
                    unfav_dates.Add(unfav_date);
                }
                return unfav_dates;
            }
            else {
                Console.WriteLine("GetUnfavDate：資料庫為空！");
            }
            sqlConnection.Close();
            return unfav_dates;

        }
    }

}