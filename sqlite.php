<?php

class SQLiteClass {

	public $dbname = "rss";
	public $file = "rss.sqlite3";
    public $db;

    public function connect() {
        try {
        	$this->db = new PDO(
        		"sqlite:".($this->file));
        	$this->db->exec("CREATE TABLE IF NOT EXISTS feeds(
        		id INTEGER PRIMARY KEY,
        		url TEXT,
        		name TEXT,
        		icon TEXT,
        		lastTime INTEGER DEFAULT 0,
        		lastIndex INTEGER DEFAULT 0)");

        } catch (PDOException $e) {
        	echo $e->getMessage();
        }
    }

    public function insertRSS($url,$name,$icon){
    	$insert = "INSERT INTO feeds(url, name, icon)
    		VALUES (:url, :name, :icon)";
    	$stmt = $this->db->prepare($insert);
		$stmt->bindValue(':url', $url, SQLITE3_TEXT);
		$stmt->bindValue(':name', $name, SQLITE3_TEXT);
		$stmt->bindValue(':icon', $icon, SQLITE3_TEXT);
      	return $stmt->execute();
    }

    public function getAll(){
    	return $this->db->query('SELECT * FROM feeds');
    }

    public function getURL($feedID){
        $select = "SELECT url FROM feeds WHERE id = :id";
        $stmt = $this->db->prepare($select);
        $stmt->bindValue(':id', $feedID);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result[0];
    }

    public function clearAll(){
    	$this->db->exec("DROP TABLE feeds");
    	$this->connect();
    }
}

?>