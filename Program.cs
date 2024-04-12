var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add session service.
builder.Services.AddSession(options =>
{
    // 設定 Session Cookie 的名稱
    options.Cookie.Name = ".YourApp.Session";
    // 設定 Session 的閒置超時時間為 30 分鐘
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    // 設定 Session Cookie 是否僅限於 HTTP 訪問
    options.Cookie.HttpOnly = true;
    // 設定 Session Cookie 是否是必要的，即使 HTTP 請求不支持 Cookie
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// 啟用 HTTPS 重新導向和靜態檔案服務
app.UseHttpsRedirection();
app.UseStaticFiles();

// 啟用路由
app.UseRouting();

// 啟用授權
app.UseAuthorization();

// 添加 Session 中介軟體
app.UseSession();

// 將請求對應到控制器動作
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
