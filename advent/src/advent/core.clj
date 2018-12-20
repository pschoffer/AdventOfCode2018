(ns advent.core
  (:gen-class)
  (:require [advent.day20 :as d]))




(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println
   (count (d/roomsOverX d/doors 999))))



