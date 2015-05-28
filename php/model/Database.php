<?php
class Database {
//comment Privates the below into a Database.
    private $connection;
    private $host;
    private $username;
    private $password;
    private $database;
    public $error;
    public function __construct($host, $username, $password, $database) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
 //comment This makes the new mysqli And the $host and $username, $password to connect.
        $this->connection = new mysqli($host, $username, $password);
        
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }
        $exists = $this->connection->select_db($database);
        if (!$exists) {
            $query = $this->connection->query("CREATE DATABASE $database");
            if ($query) {
                echo "<p>Succesfully created database: " . $database . "<p/>";
            }
        } else {
            echo "<p>Database already exists.</p>";
        }
    }
    public function openConnection() {
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
//comment If the connection fails then it dies!
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }
    }
    public function closeConnection() {
        if (isset($this->connection)) {
            $this->connection->close();
        }
    }
//comment Opens the query open to the public!!
    public function query($string) {
        $this->openConnection();
        $query = $this->connection->query($string);
        
        if(!$query) {
            $this->error = $this->connection->error;
        }
        return $query;
    }
}