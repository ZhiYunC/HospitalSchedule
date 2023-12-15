using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Models{
    public class DBmanager
    {
        private readonly string connString = "server=localhost;port=3306;user id=zhiyun;password=abcd123456789;database=hospitalscheduling;charset=utf8;";
        //取得科別醫生列表
        public List<Doctor> GetDoctors(string subdepartment) {
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,doctor_department FROM `doctors`  WHERE (doctor_department=@subdepartment)");
            sqlCommand.Parameters.AddWithValue("@subdepartment", subdepartment);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
                        Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        Department  = reader.GetString(reader.GetOrdinal("doctor_department")),
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
        //取得當月醫生班數
        public List<Doctor> GetShift() {
            DateTime dtNow = DateTime.Now;
            string department = "一般內科";
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
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,shift FROM `doctors` INNER JOIN `setting` ON (doctors.doctor_id=setting.setting_doctor_id) WHERE(doctor_department=@department)&&(month=@nextMonth)&&(year=@nextYear)");
            sqlCommand.Parameters.AddWithValue("@nextMonth", nextMonth);
             sqlCommand.Parameters.AddWithValue("@nextYear", nextYear);
              sqlCommand.Parameters.AddWithValue("@department", department);
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
                        Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        Shift  = reader.GetInt16(reader.GetOrdinal("shift")),
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
       
        //新增班數
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
                        MySqlCommand sqlCommand = new MySqlCommand("INSERT INTO `setting` (setting_doctor_id, shift,month,year,ward) VALUES (@doctorId, @shift,@month,@year,@ward)", sqlConnection);
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
        //取得班表(測試)
        public List<Schedule> GetSchedule() {
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
        //取得醫生電話
        public List<Doctor> GetDoctorPhone() {
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,doctor_phone,doctor_department FROM `doctors`ORDER BY doctor_department");
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
                        Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        Department  = reader.GetString(reader.GetOrdinal("doctor_department")),
                        Doctor_Phone  = reader.GetString(reader.GetOrdinal("doctor_phone")),
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
    }
}
