package main

import (
	"fmt"
	"net/http"
	"os/exec"
	"time"
)

func handleCORS(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		h.ServeHTTP(w, r)
	}
}

func buildGraph() {
	out, err := exec.Command("/usr/local/bin/python", "/opt/traceroute.py").Output()
	if err != nil {
		fmt.Printf("%s", err.Error())
	}
	fmt.Printf("%s", out)
}

func main() {
	ticker := time.NewTicker(2 * time.Hour)
	go func() {
		buildGraph()
		for {
			select {
			case <-ticker.C:
				buildGraph()
			}
		}
	}()

	http.Handle("/", handleCORS(http.FileServer(http.Dir("/web"))))

	http.ListenAndServe(":80", nil)
}
