using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySql.Data.MySqlClient;

namespace Demo.Models{
    public class DBmanager
    {
        private readonly string connString = "server=localhost;port=3306;user id=zhiyun;password=abcd123456789;database=hospitalscheduling;charset=utf8;";
        public List<Doctor> GetDoctors() {
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT doctor_id,doctor_name,doctor_department,shift FROM `doctors` INNER JOIN `setting` ON (doctors.doctor_id=setting.doctor_setting_id)");
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();
            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        ID = reader.GetInt32(reader.GetOrdinal("doctor_id")),
                        Name  = reader.GetString(reader.GetOrdinal("doctor_name")),
                        Department  = reader.GetString(reader.GetOrdinal("doctor_department")),
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

        public void NewShift(Doctor doctor){
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand(
                @"INSERT INTO setting (doctor_setting_id,shift,month) VALUES (doctor@doctor.id,@shift,11)");
            sqlCommand.Connection = sqlConnection;
            sqlCommand.Parameters.Add(new MySqlParameter("doctor@doctor.id",doctor.ID));
            sqlCommand.Parameters.Add(new MySqlParameter("@shift",doctor.Shift));
            sqlConnection.Open();
            sqlCommand.ExecuteNonQuery();
            sqlConnection.Close();
        }
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
    }
}
