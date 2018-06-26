#!/bin/bash
export GLOBUS_TCP_PORT_RANGE=50000,51000
export GLOBUS_TCP_SOURCE_RANGE=50000,51000
globus-url-copy -vb -fast -p 16 ftp://hpcdtn01-ext.clemson.edu:2811/export/data/10G.dat file:///export/data/10G.out
globus-url-copy -vb -fast -p 16 ftp://maserati.sciencedmz.nps.edu:2811/export/data/10G.dat file:///export/data/10G.out
globus-url-copy -vb -fast -p 16 ftp://ps-40g-gridftp.calit2.optiputer.net:2811/export/data/10G.dat file:///export/data/10G.out
globus-url-copy -vb -fast -p 16 ftp://dtn.cahnrs.wsu.edu:2811/export/data/10G.dat file:///export/data/10G.out