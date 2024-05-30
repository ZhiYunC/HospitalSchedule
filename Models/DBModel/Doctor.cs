namespace Demo.Models{
    public class Doctor{
        public int Doctor_ID { get; set; }
        public string Doctor_Name { get; set;}
        public string Doctor_Department { get; set;}
        public int Shift { get; set;}
        public string Doctor_Phone { get; set;}

        public int Doctor_Color { get; set;}
        public List<DateTime> Unfav_Dates { get; set; }

        public bool Doctor_State { get; set;}
    }
}
