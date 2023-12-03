// using System.Diagnostics;
// using Microsoft.AspNetCore.Mvc;
// using Demo.Models;

// namespace Demo.Controllers;

// public class HomeController : Controller
// {
//     private readonly ILogger<HomeController> _logger;

//     public HomeController(ILogger<HomeController> logger)
//     {
//         _logger = logger;
//     }

//     public IActionResult Index()
//     {
//         return View();
//     }

//     public IActionResult Privacy()
//     {
//         return View();
//     }

//     [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
//     public IActionResult Error()
//     {
//         return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
//     }
//     //new

// }

// HomeController.cs
using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        // 执行页面跳转
        return RedirectToAction("calender", "Manager"); // 跳转到 Home 控制器的 Welcome 动作方法
        // return View();
    }
    public IActionResult Privacy()
    {
        return View();
    }
    // POST: /Login/Login
    [HttpPost]
    public IActionResult Login()
    {
        // 处理登录逻辑，如果需要的话

        // 执行页面跳转
        return RedirectToAction("calender", "Manager"); // 跳转到 Home 控制器的 Welcome 动作方法
    }
}