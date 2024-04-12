// HomeController.cs
using Demo.Models;
using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        // 执行页面跳转
        // return RedirectToAction("Index", "Home"); // 跳转到 Home 控制器的 Welcome 动作方法
        return View();
    }
    public IActionResult Privacy()
    {
        return View();
    }
    // 管理者登入
    [HttpPost]
    public IActionResult ManagerLogin(IFormCollection post)
    {
        string Username = post["Username"];
        string Password = post["Password"];
        try{
            // 登入邏輯
            DBmanager dbmanager = new DBmanager();
            if(dbmanager.CheckManagerData(Username,Password)){
                // 登入成功
                return RedirectToAction("HistorySchedule", "Manager");
            }else{
                // 登入失敗
                return RedirectToAction("Index", "Home");
            }
        }catch(Exception e){
            Console.WriteLine("Error: " + e.ToString());
            return RedirectToAction("Index", "Home");
        }
    }
    // 醫生登入
    [HttpPost]
    public IActionResult DoctorLogin(IFormCollection post)
    {
        string Username = post["Username"];
        string Password = post["Password"];
        try{
            // 登入邏輯
            DBmanager dbmanager = new DBmanager();
            
            if(dbmanager.CheckDoctorData(Username,Password)){
                // 登入成功
                int UserId=dbmanager.GetUserId(Username);
                HttpContext.Session.SetInt32("UserId", UserId);
                return RedirectToAction("index", "Doctor");
            }else{
                // 登入失敗
                return RedirectToAction("Index", "Home");
            }
        }catch(Exception e){
            Console.WriteLine("Error: " + e.ToString());
            return RedirectToAction("Index", "Home");
        }
    }

}