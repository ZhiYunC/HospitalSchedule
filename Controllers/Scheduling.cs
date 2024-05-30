using Demo.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;


namespace Demo.Controllers
{
    public class SchedulingController : Controller
    {
        [HttpPost]
        public IActionResult StartSchedule(string subdepartment)
        {
            DBmanager dbmanager = new DBmanager();
            
            var currentDate = DateTime.Now; //現在時間
            var twoMonthsLater = currentDate.AddMonths(2); //兩個月後
            int year = twoMonthsLater.Year; //兩個月後年
            int month = twoMonthsLater.Month; //兩個月後月
            Console.WriteLine("year：" +year+"month："+month+"subdepartment："+subdepartment);

            // 取得班數表
            List<Doctor> doctors=dbmanager.GetShift(year,month,subdepartment);
            List<int> docId = new List<int>(); //放醫生ID
            var usageLimits = new Dictionary<int, int>(); //放醫生ID、班數
            var restrictions = new Dictionary<int, List<int>>(); //放醫生ID、不能上班日
            
            // 將讀取的醫生班數儲存
            foreach (var doctor in doctors)
            {
                docId.Add(doctor.Doctor_ID);
                usageLimits[doctor.Doctor_ID] = doctor.Shift;
                Console.WriteLine("doctor.Doctor_ID：" +doctor.Doctor_ID+"doctor.Shift："+usageLimits[doctor.Doctor_ID]);
            }
            // 將讀取的醫生不想上班日期儲存
            foreach (var id in docId)
            {
                List<DateTime> unfavDates = dbmanager.GetUnfavDate(id, month, year);
                // Console.WriteLine(unfavDates[0]);

                // restrictions[id] = unfavDates.Select(date => date.Day - 1).ToList(); // 日期轉為索引
                
                // // 將日期轉換為字符串並輸出
                // string unfavDatesStr = string.Join(", ", unfavDates.Select(date => date.ToString("yyyy-MM-dd")));
                // Console.WriteLine($"doctor.Doctor_ID: {id}, unfavDates: {unfavDatesStr}");
                // 只存储日期的日部分
                restrictions[id] = unfavDates.Select(date => date.Day).ToList();
                
                // 将日期的日部分转换为字符串并输出
                string unfavDatesStr = string.Join(", ", unfavDates.Select(date => date.Day.ToString()));
                Console.WriteLine($"doctor.Doctor_ID: {id}, unfavDates: {unfavDatesStr}");
            }
            

            var firstDayOfMonth = new DateTime(year, month, 1);
            int firstDayIndex = (int)firstDayOfMonth.DayOfWeek;  // 正确引用属性 DayOfWeek
            int numPers = DateTime.DaysInMonth(year, month);

            int lastSaturdayId = 0 ;
            int lastSundayId = 0 ;
            int previousId = 0 ;
            Dictionary<DateTime, int> date = new Dictionary<DateTime, int>();
            List<DateTime> missingDays = new List<DateTime>();

            // var docId = new List<string> { "001", "002", "003", "004", "005" };
            var docIdToName = new Dictionary<string, string>
            {
                {"001", "陳芷芸"},
                {"002", "林書榆"},
                {"003", "萬家妤"},
                {"004", "曾偉倫"},
                {"005", "陳麗卿"}
            };

            
            

            var usageCounts = docId.ToDictionary(id => id, id => 0);

            int totalUsageLimits = usageLimits.Values.Sum();
            if (totalUsageLimits < numPers)
            {
                throw new Exception($"指定的 ID 使用次數總和不足以填滿 date 陣列。缺少 {numPers - totalUsageLimits} 次使用機會。請調整 usage_limits。");
            }

            for (int day = 1; day <= numPers; day++)
            {
                DateTime key = new DateTime(year, month, day);
                DayOfWeek weekday = key.DayOfWeek;
                bool isSaturday = weekday == DayOfWeek.Saturday;
                bool isSunday = weekday == DayOfWeek.Sunday;

                var availableIds = docId
                    .Where(id => id != previousId
                        && !((isSaturday || isSunday) && (id == lastSaturdayId || id == lastSundayId))
                        && !restrictions[id].Contains(day)
                        && usageCounts[id] < usageLimits[id])
                    .ToList();

                if (availableIds.Any())
                {
                    int currentId = availableIds[new Random().Next(availableIds.Count)];
                    date[key] = currentId;
                    usageCounts[currentId]++;

                    if (isSaturday) lastSaturdayId = currentId;
                    if (isSunday) lastSundayId = currentId;

                    previousId = currentId;
                }
                else
                {
                    date[key] = -1; // 使用 -1 表示 "從缺"
                    missingDays.Add(key);
                }
            }

            var result = new List<string>();
            var schedules = new List<Schedule>();

            foreach (var k in date.Keys)
            {
                schedules.Add(new Schedule { Schedule_date = k, Schedule_doctor_id = date[k] });
                // DayOfWeek weekday = k.DayOfWeek;
                // string weekdayTag = weekday == DayOfWeek.Saturday ? " 六" : weekday == DayOfWeek.Sunday ? " 日" : "";
                // string display = date[k] == -1 ? "從缺" : $"{date[k]}, 名字: {docIdToName[date[k].ToString("000")]}{weekdayTag}";
                // result.Add($"{k.ToString("yyyy-MM-dd")}: {display}");
                // Console.WriteLine($"{k.ToString("yyyy-MM-dd")}: {display}");
            }
            dbmanager.NewSchedule(schedules,subdepartment);
            Console.WriteLine("Schedule_doctor_id： " +schedules[0].Schedule_doctor_id);
            Console.WriteLine("無法分配 ID 的日期： " + string.Join(", ", missingDays.Select(d => d.ToString("yyyy-MM-dd"))));
            result.Add("無法分配 ID 的日期： " + string.Join(", ", missingDays.Select(d => d.ToString("yyyy-MM-dd"))));

            return Json(result);
        }
    }
}
