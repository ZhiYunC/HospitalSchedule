namespace Demo.Models{
    public class Schedule{
        public int Schedule_id { get; set; }
        public DateTime Schedule_date { get; set;}

        // public string Schedule_Date { get; set;}

        public int Schedule_doctor_id { get; set; }
        
        public int Schedule_day { get; set;}
        public int Schedule_doctor_color { get; set;}
        public int Schedule_department_id { get; set; }
        public string Schedule_doctor_name { get; set;}
         public string Schedule_department_name { get; set;}
        // public int Schedule_department_id { get; set;}
    }
}
