package main

import (
	"fmt"
	"github.com/guotie/deferinit"
	"github.com/swgloomy/gutil/glog"
	"io/ioutil"
	"sync"
	"time"
)

func init() {
	deferinit.AddRoutine(watchFilesProcess)
}

func watchFilesProcess(ch chan struct{}, wg *sync.WaitGroup) {
	var (
		jsTmr *time.Timer
	)
	go func() {
		<-ch

		jsTmr.Stop()
		wg.Done()
	}()

	jsTmr = time.NewTimer(getMyEveyDayFourTime())
	glog.Info(" watch watchFilesProcess is waiting! \n")
	<-jsTmr.C
	for {
		glog.Info(" watch watchFilesProcess is loading! \n")
		go pictureProcess()
		jsTmr.Reset(getMyEveyDayFourTime())
		glog.Info(" watch watchFilesProcess is waiting! \n")
		<-jsTmr.C
	}
}

func getMyEveyDayFourTime() time.Duration {
	return time.Duration(28-time.Now().Hour()) * time.Hour
}

func pictureProcess() {
	files, _ := ioutil.ReadDir(pictureDir)
	for _, f := range files {
		fmt.Println(f.Name())
	}
}
