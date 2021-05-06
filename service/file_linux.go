package main

import (
	"os"
	"runtime"
	"syscall"
	"time"
)

func getFileCreateTime(path string) int64 {
	osType := runtime.GOOS
	fileInfo, _ := os.Stat(path)
	if osType == "linux" {
		stat_t := fileInfo.Sys().(*syscall.Stat_t)
		tCreate := int64(stat_t.Ctim.Sec)
		return tCreate
	}
	return time.Now().Unix()
}
