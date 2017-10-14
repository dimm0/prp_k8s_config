package main

import (
	"fmt"
	"net/http"
	"os/exec"
	"time"
)

func main() {

	out, err := exec.Command("/usr/local/bin/python", "/opt/traceroute.py").Output()
	if err != nil {
		fmt.Printf("%s", err.Error())
	}
	fmt.Printf("%s", out)

	ticker := time.NewTicker(5 * time.Minute)
	go func() {
		for {
			select {
			case <-ticker.C:
				out, err := exec.Command("/usr/local/bin/python", "/opt/traceroute.py").Output()
				if err != nil {
					fmt.Printf("%s", err.Error())
				}
				fmt.Printf("%s", out)
			}
		}
	}()

	http.Handle("/", http.FileServer(http.Dir("/web")))

	http.ListenAndServe(":80", nil)
}
