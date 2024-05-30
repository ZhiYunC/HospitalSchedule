// ManagerController.cs
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Controllers
{
    public class DoctorController : Controller
    {
        // (暫定班表頁面)
        // let userId = HttpContext.Session.GetInt32("UserId");
        public IActionResult Index()
        {
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            Doctor doctor = dbmanager.GetInformation(userId);
            ViewBag.doctor=doctor;
            return View();
        }
        [HttpGet]
        public bool GetDoctorState(){
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            bool doctor_state = dbmanager.GetDoctorState(userId);        
            return doctor_state;
        }
        // (導航欄)
        public IActionResult DoctorShare()
        {
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            Doctor doctor = dbmanager.GetInformation(userId);        
            ViewBag.doctor=doctor;
            return View();
        }

        // (歷史班表頁面)
        public IActionResult HistorySchedule()
        {
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            Doctor doctor = dbmanager.GetInformation(userId);        
            ViewBag.doctor=doctor;
            return View();
        }

        // (選擇日期頁面)
        public IActionResult Scheduling()
        {
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

            return View();
        }

        // (測試頁面)
        // public IActionResult Test()
        // {
        //     DBmanager dbmanager = new DBmanager();
        //     List<Schedule> schedules = dbmanager.GetSchedule(11,11,"1");
        //     ViewBag.schedules = schedules;
           
        //     List<string> doctorNamesList = new List<string>();
        //     foreach (var schedule in schedules)
        //     {
        //     // 将医生名字添加到列表中
        //         doctorNamesList.Add(schedule.Schedule_doctor_name);
        //     }
        //     ViewBag.doctorNamesLists = doctorNamesList;

        //     return View();
        // }
        // 讀取班表
        [HttpGet]
        public IActionResult GetScheduleData(int year,int month,string subdepartment)
        {
            DBmanager dbmanager = new DBmanager();
            // 獲取登入醫生的科別存入doctordepartment
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            Doctor doctor = dbmanager.GetInformation(userId);
            string doctordepartment =doctor.Doctor_Department;
            // 班表數據存入scheduleList的List中
            List<Schedule> schedules = dbmanager.GetSchedule(year,month,doctordepartment);
            // List<string> doctorNamesList = new List<string>();
            // foreach (var schedule in schedules)
            // {
            // // 将医生名字添加到列表中
            //     doctorNamesList.Add(schedule.Schedule_doctor_name);
            // }
            return Json(schedules);
        }
        //新增日期 
        [HttpPost]
        public IActionResult SaveDates([FromBody] List<DateTime> dates)
        {
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;

            dbmanager.NewUnfavDate(dates,userId);
            // 在這裡處理接收到的日期數據，並將其存入資料庫
            // foreach (var date in dates)
            // {
                
            // }
            // 返回 JSON 成功訊息
            return Json(new { success = true, message = "Dates saved successfully." });
        }
        //更新班表確認狀態 
        [HttpPost]
        public IActionResult UpdateState()
        {
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            Console.WriteLine("DoctorController");
            Console.WriteLine(userId);
            dbmanager.UpdateState(userId);
            return Json(new { success = true, message = "Dates saved successfully." });
        }
        [HttpPost]
        public IActionResult GetUnfavDate(int month,int year)
        {
            DBmanager dbmanager = new DBmanager();
            int userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            List<DateTime> unfav_dates=dbmanager.GetUnfavDate(userId,month+1,year);
            // Console.WriteLine(unfav_dates);
            return Json(unfav_dates);
        }
    }
}