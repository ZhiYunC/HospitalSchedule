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
            return View();
        }
        public IActionResult Schedule()
        {
            return View();
        }

        public IActionResult Schedule_setting()
        {
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            // ViewData["Data"] = GetDataFromDatabase();
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetDoctors();
            ViewBag.doctors = doctors;
            return View();
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
            return View();
        }

        // read為測試用
        public IActionResult read()
        {
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            // ViewData["Data"] = GetDataFromDatabase();
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetDoctors();
            ViewBag.doctors = doctors;
            return View();
        }

    }
}
