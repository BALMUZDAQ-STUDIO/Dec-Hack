const express = require("express");
const mysql = require("mysql2");
const { v4: uuidv4 } = require('uuid');
const multer  = require("multer");
const fs = require('fs');
const path = require('path');