// ManagerController.cs
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Controllers
{
    public class DoctorController : Controller
    {
        // (暫定班表頁面)
        // int? userId = HttpContext.Session.GetInt32("UserId");
        public IActionResult Index()
        {
            DBmanager dbmanager = new DBmanager();
            //需修改參數
            List<Schedule> schedules = dbmanager.GetSchedule(11,11,"1");
            // ViewBag.schedules = schedules;
            Console.WriteLine(schedules.Count);
            
            return View(schedules);
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
            return View();
        }

        // (選擇日期頁面)
        public IActionResult Scheduling()
        {
            return View();
        }

        // (測試頁面)
        public IActionResult Test()
        {
            DBmanager dbmanager = new DBmanager();
            List<Schedule> schedules = dbmanager.GetSchedule(11,11,"1");
            ViewBag.schedules = schedules;
           
            List<string> doctorNamesList = new List<string>();
            foreach (var schedule in schedules)
            {
            // 将医生名字添加到列表中
                doctorNamesList.Add(schedule.Schedule_doctor_name);
            }
            ViewBag.doctorNamesLists = doctorNamesList;

            return View();
        }
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
            List<string> doctorNamesList = new List<string>();
            foreach (var schedule in schedules)
            {
            // 将医生名字添加到列表中
                doctorNamesList.Add(schedule.Schedule_doctor_name);
            }
            return Json(doctorNamesList);
        }
        //新增日期 
        [HttpPost]
        public IActionResult SaveDates([FromBody] List<DateTime> dates)
        {
            DBmanager dbmanager = new DBmanager();
            dbmanager.NewUnfavDate(dates);
            // 在這裡處理接收到的日期數據，並將其存入資料庫
            // foreach (var date in dates)
            // {
                
            // }
            // 返回 JSON 成功訊息
            return Json(new { success = true, message = "Dates saved successfully." });
        }
    }
}