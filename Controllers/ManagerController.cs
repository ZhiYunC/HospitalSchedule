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
            List<Doctor> doctors = dbmanager.GetDoctors();
            ViewBag.doctors = doctors;
            return View();
        }
        public IActionResult Schedule()
        {
            return View();
        }

        public IActionResult Schedule_setting(string subdepartment)
        {
            int departmentId = ConvertSubdepartmentToId(subdepartment); // 轉換 subdepartment 為對應的 departmentId
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetDoctors();
            ViewBag.doctors = doctors;
            return View();
        }
        private int ConvertSubdepartmentToId(string subdepartment) {
            // 這裡加入將 subdepartment 字串轉換為 departmentId 的邏輯
            if (subdepartment == "神經外科") return 11;
            // ...其他 subdepartment 的轉換
            return 0;
        }

        public IActionResult Share()
        {
            return View();
        }

        public IActionResult doctor_date()
        {
            return View();
        }

        public IActionResult calender()
        {
            DBmanager dbmanager = new DBmanager();
            List<Schedule> schedules = dbmanager.GetSchedule();
            ViewBag.schedules = schedules;
            return View();
        }

        // read為測試用
        public IActionResult read()
        {
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            // ViewData["Data"] = GetDataFromDatabase();
            DBmanager dbmanager = new DBmanager();
            List<Schedule> schedules = dbmanager.GetSchedule();
            ViewBag.schedules = schedules;
            return View();
        }
        [HttpPost]
        public ActionResult CreateShift(Doctor doctor){
            DBmanager dbmanager = new DBmanager();
            try{
                dbmanager.NewShift(doctor);
            }
            catch(Exception e ){
                Console.WriteLine(e.ToString());
            }
            return RedirectToAction("Schedule");
        }
    }
}
