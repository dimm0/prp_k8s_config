include local.mk

YAMLPROTOTYPES = globus-pc-service.yaml.in  globus-pc-volume.yaml.in   globus-pc.yaml.in

SEDSPEC = \
-e "s/@NAMESPACE@/$(NAMESPACE)/"  \
-e "s%@REGISTRY@%$(REGISTRY)%"  \
-e "s/@SIZE@/$(SIZE)/"  

YAMLFILES=$(subst .in,,$(YAMLPROTOTYPES))

default: $(YAMLFILES)

yaml: $(YAMLFILES)

$(YAMLFILES):
	sed $(SEDSPEC) $@.in > $@

IMAGE = globus-personal-connect

image: yaml
	docker build -t $(IMAGE) . 
	docker tag $(IMAGE) $(REGISTRY)/$(IMAGE)
	docker push $(REGISTRY)/$(IMAGE):latest

clean:
	- /bin/rm $(YAMLFILES)

