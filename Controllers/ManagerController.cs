// ManagerController.cs
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Controllers
{
    public class ManagerController : Controller
    {
        // GET: /Login/Index
        public IActionResult Index()
        {
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            // ViewData["Data"] = GetDataFromDatabase();
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetShift(2024,3,"一般內科");
            // ViewBag.doctors = doctors;
            return View();
        }
        [HttpGet]
        public IActionResult GetShiftData(int year,int month,string subdepartment)
        {
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetShift(year,month,subdepartment);
            return Json(doctors);
        }

        public IActionResult SelectSubject ()
        {
            return View();
        }
        
        public IActionResult ManagerShare()
        {
            return View();
        }
        [HttpGet]
        public  IActionResult GetDoctors(string selectedsubdepartment)
        {
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetDoctors(selectedsubdepartment);
            return Json(doctors);;
        }
        public IActionResult Scheduling()
        {   
            // int departmentId = ConvertSubdepartmentToId(subdepartment); // 轉換 subdepartment 為對應的 departmentId
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            
            return View();
        }
        // ??
        [HttpPost]
        public  IActionResult Scheduling(List<Setting> worktimeData)
        {
            String ward = "一般病房";
            DBmanager dbmanager = new DBmanager();
            try{
                Console.WriteLine(worktimeData);
                dbmanager.NewShift(worktimeData,ward);
                
            }
            catch(Exception e){
                Console.WriteLine(e.ToString());
            }
            return RedirectToAction("SelectSubject");

        }
        // private int ConvertSubdepartmentToId(string subdepartment) {
        //     // 這裡加入將 subdepartment 字串轉換為 departmentId 的邏輯
        //     if (subdepartment == "神經外科") return 11;
        //     // ...其他 subdepartment 的轉換
        //     return 0;
        // }


        public IActionResult doctor_date()
        {
            return View();
        }

        public IActionResult HistorySchedule()
        {
            

            // ViewBag.doctorNamesLists= doctorNamesList;
            return View();
        }
        [HttpGet]
        public IActionResult GetScheduleData(int year,int month,string subdepartment)
        {
            // 假設你的班表數據存在在名為scheduleList的List中
            DBmanager dbmanager = new DBmanager();
            List<Schedule> schedules = dbmanager.GetSchedule(year,month,subdepartment);
            
            List<string> doctorNamesList = new List<string>();
            foreach (var schedule in schedules)
            {
            // 将医生名字添加到列表中
                doctorNamesList.Add(schedule.Schedule_doctor_name);
            }
            return Json(doctorNamesList);
        }
        // read為測試用
        // public IActionResult ExpandSchedule()
        // {
        //     // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
        //     // ViewData["Data"] = GetDataFromDatabase();
        //     DBmanager dbmanager = new DBmanager();
        //     List<Doctor> doctors = dbmanager.GetDoctorPhone();
        //     ViewBag.doctors = doctors;
        //     return View();
        // }
        // [HttpPost]
        // public ActionResult CreateShift(Doctor doctor){
        //     DBmanager dbmanager = new DBmanager();
        //     try{
        //         dbmanager.NewShift(doctor);
        //     }
        //     catch(Exception e ){
        //         Console.WriteLine(e.ToString());
        //     }
        //     return RedirectToAction("Schedule");
        // }
        // [HttpPost]
        // public ActionResult ViewNextSchedule(String DepartmentName){
        //     DBmanager dbmanager = new DBmanager();
        //     try{
        //         dbmanager.NewShift(DepartmentName);
        //     }
        //     catch(Exception e ){
        //         Console.WriteLine(e.ToString());
        //     }
        //     return RedirectToAction("Schedule");
        // }
    }
}
