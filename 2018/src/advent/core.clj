(ns advent.core
  (:gen-class)
  (:require [advent.day25 :as d]))




(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println
   (d/countConstalations d/points)))



