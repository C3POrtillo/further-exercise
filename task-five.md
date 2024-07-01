1. List authors(id, first_name, last_name, country_name), book name, ISBN, price, discount, is_hard_copy - if they have books, or null if they don't. Order by author last_name, first_name.
```SQL
SELECT 
    a.id, 
    a.first_name, 
    a.last_name, 
    c.name,
    b.title,
    b.isbn,
    bd.price,
    bd.discount,
    bd.is_hard_copy
FROM author a
LEFT JOIN country c ON a.country_id = c.id
LEFT JOIN book b ON a.id = b.author_id
LEFT JOIN bookdetails bd ON b.id = bd.book_id
ORDER BY a.last_name, a.first_name;
```

2. List authors (id, first_name, last_name, country_name) where country code is the USA.
```SQL
SELECT 
    a.id, 
    a.first_name, 
    a.last_name, 
    c.name
FROM author a
JOIN country c ON a.country_id = c.id
WHERE c.code = 'USA'
```
3. List authors(id, first_name, last_name, country_name) with books. Order by the number of books descending.
```SQL
SELECT 
    a.id, 
    a.first_name, 
    a.last_name, 
    c.name,
    COUNT(b.id) AS book_count
FROM author a
JOIN country c ON a.country_id = c.id
JOIN book b ON a.id = b.author_id
GROUP BY a.id, a.first_name, a.last_name, c.name
ORDER BY book_count DESC;
```
4. Select how many books are from USA authors.
```SQL
SELECT 
    COUNT(b.id) AS book_count
FROM book b
JOIN author a ON b.author_id = a.id
JOIN country c ON a.country_id = c.id
WHERE c.code = 'USA';
```
5. Select books (title, isbn, discount, price) where 20 <= discount <=30, order by price
increasing.
```SQL
SELECT 
    b.title, 
    b.isbn, 
    bd.discount, 
    bd.price
FROM book b
JOIN bookdetails bd ON b.id = bd.book_id
WHERE bd.discount BETWEEN 20 AND 30
ORDER BY bd.price ASC;
```

6. List the cheapest book (price) of every author (first_name, last_name). If an author does
not have books, display -1 as the price.
```SQL
SELECT 
    a.first_name, 
    a.last_name, 
    COALESCE(MIN(bd.price), -1) AS cheapest_price
FROM author a
LEFT JOIN book b ON a.id = b.author_id
LEFT JOIN bookdetails bd ON b.id = bd.book_id
GROUP BY a.id, a.first_name, a.last_name;
```
