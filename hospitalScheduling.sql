
-- 新增
INSERT INTO doctors VALUES (3,"Amy");


-- 查詢
SELECT * FROM doctors;

SELECT  FROM doctors;
SELECT schedule_id,schedule_date,doctor_name FROM `schedule` INNER JOIN `doctors` ON (doctors.doctor_id=schedule.schedule_doctor_id)


-- 更新
UPDATE doctors
SET num=2
WHERE id=1;

UPDATE doctors
SET num=3
WHERE id=2;

UPDATE doctors
SET num=2
WHERE id=3;

-- 增加欄位
ALTER TABLE doctors ADD num char(1);
-- 改型態
ALTER TABLE doctors MODIFY num int(1);