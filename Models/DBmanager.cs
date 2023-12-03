using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Demo.Models{
    public class DBmanager
    {
        // private readonly string ConnStr = "";
        public List<Doctor> GetDoctors() {
            string connString = "server=localhost;port=3306;user id=zhiyun;password=abcd123456789;database=hospitalscheduling;charset=utf8;";
            List<Doctor> doctors = new List<Doctor>();
            MySqlConnection sqlConnection = new MySqlConnection(connString);
            MySqlCommand sqlCommand = new MySqlCommand("SELECT * FROM doctors");
            sqlCommand.Connection = sqlConnection;
            sqlConnection.Open();

            MySqlDataReader reader = sqlCommand.ExecuteReader();
            if (reader.HasRows) {
                while (reader.Read()) {
                    Doctor doctor = new Doctor {
                        ID = reader.GetInt32(reader.GetOrdinal("id")),
                        Name  = reader.GetString(reader.GetOrdinal("name")),
                        Department  = reader.GetString(reader.GetOrdinal("department")),
                        Num  = reader.GetString(reader.GetOrdinal("num")),
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
