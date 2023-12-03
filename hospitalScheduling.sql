
-- 新增
INSERT INTO doctors VALUES (3,"Amy");


-- 查詢
SELECT * FROM doctors;


-- 更新
UPDATE doctors
SET name="陳芷芸",department="一般外科"
WHERE id=1;

UPDATE doctors
SET name="林書榆",department="一般內科"
WHERE id=2;

UPDATE doctors
SET name="萬家妤",department="一般內科"
WHERE id=3;