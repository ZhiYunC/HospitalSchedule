// ManagerController.cs
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Demo.Models;

namespace Demo.Controllers
{
    public class ManagerController : Controller
    {
        // GET: /Login/Index
        public IActionResult ManagerShare()
        {
            return View();
        }
        public IActionResult Index()
        {
            // 在這裡從數據庫獲取數據，並將數據傳遞給視圖
            // ViewData["Data"] = GetDataFromDatabase();
            // DBmanager dbmanager = new DBmanager();
            // List<Doctor> doctors = dbmanager.GetShift(2024,3,"一般內科");
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
        // [HttpPost]
        // public  IActionResult Scheduling(List<Setting> worktimeData)
        // {
        //     String ward = "一般病房";
        //     DBmanager dbmanager = new DBmanager();
        //     try{
        //         Console.WriteLine(worktimeData);
        //         // dbmanager.NewShift(worktimeData,ward);
                
        //     }
        //     catch(Exception e){
        //         Console.WriteLine(e.ToString());
        //     }
        //     return View();

        // }
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
        public IActionResult Test()
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
            
            // List<string> doctorNamesList = new List<string>();
            // foreach (var schedule in schedules)
            // {
            // // 将医生名字添加到列表中
            //     doctorNamesList.Add(schedule.Schedule_doctor_name);
            // }
            return Json(schedules);
        }
        [HttpPost]
        public  IActionResult UpdateSchedule([FromBody] List<Schedule> schedules)
        {
            DBmanager dbmanager = new DBmanager();
            try
            {
                dbmanager.UpdateSchedule(schedules);
                return Json(new { success = true, message = "Dates saved successfully." });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Json(new { success = false, message = "Dates don't saved successfully." });
            }

        }
        [HttpGet]
        public  IActionResult CheckSchedulingCompleted(int start,int end)
        {
            DBmanager dbmanager = new DBmanager();
            try
            {
                // 初始化列表
                List<bool> schedulingResults = new List<bool>();
                for (int i = start; i <= end; i++)
                {
                    bool result = dbmanager.CheckSchedulingCompleted(i);
                    schedulingResults.Add(result);
                }
                // 檢查result是否有false
                bool allTrue = !schedulingResults.Contains(false);
                // 返回相應Json
                return Json(new { success = allTrue, message = allTrue ? "已排班" : "未排班" });
            }
            catch (Exception ex)
            {
                // 錯誤處理
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }
        [HttpPost]
        public IActionResult GetDoctorUnfavDate(string subdepartment)
        {
            DBmanager dbmanager = new DBmanager();
            List<Doctor> doctors = dbmanager.GetShift(2024, 8, subdepartment);
            List<string> docName = new List<string>(); //放醫生ID
            // 將讀取的醫生班數儲存
            foreach (var doctor in doctors)
            {
                docName.Add(doctor.Doctor_Name);
                // Console.WriteLine("doctor.Doctor_ID：" +doctor.Doctor_ID+"doctor.Shift："+usageLimits[doctor.Doctor_ID]);
            }
            var restrictions = new Dictionary<string, List<int>>(); //放醫生ID、不能上班日

             foreach (var name in docName)
            {
                List<DateTime> unfavDates = dbmanager.MangerGetUnfavDate(name, 8, 2024);
                // 只存储日期的日部分
                restrictions[name] = unfavDates.Select(date => date.Day).ToList();
                
                // 将日期的日部分转换为字符串并输出
                string unfavDatesStr = string.Join(", ", unfavDates.Select(date => date.Day.ToString()));
                // Console.WriteLine($"ManagerController--------Doctor_Name: {name}, unfavDates: {unfavDatesStr}");
            }
            return Json(restrictions);
        }
        [HttpPost]
        public  IActionResult NewShift([FromBody] List<Doctor> doctors)
        {
            DBmanager dbmanager = new DBmanager();
            try
            {
                Console.WriteLine("doctors.Count"+doctors.Count);
                dbmanager.NewShift(doctors);
                return Json(new { success = true, message = "Dates saved successfully." });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Json(new { success = false, message = "Dates don't saved successfully." });
            }

        }
    }
}
