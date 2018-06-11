local kp = (import 'kube-prometheus/kube-prometheus.libsonnet') + (import 'kube-prometheus/kube-prometheus-kubeadm.libsonnet') + (import 'ksonnet/ksonnet.beta.3/k.libsonnet') + {
  _config+:: {
    namespace: 'monitoring',
    prometheus+:: {
      replicas: 1,
    },
    grafana+:: {
      config: {
        sections: {
          "auth.anonymous": {enabled: true},
        },
      },
    },
  },
  prometheusAlerts+:: {
    groups+: [
      {
        name: 'rook.rules',
        rules: [
          {
            alert: 'OSDOut',
            expr: 'ceph_osds - ceph_osds_in > 0',
            'for': '3m',
            labels: {
              severity: 'critical',
            },
            annotations: {
              description: 'Checks if all OSDs are UP',
              summary: 'Ceph storage functioning properly'
            },
          },
        ],
      },
      {
        name: 'cassandra.rules',
        rules: [
          {
            alert: 'InsufficientMembers',
            expr: 'count(up{job="esmond-cassandra"} == 0) > 0',
            'for': '5m',
            labels: {
              severity: 'critical',
            },
            annotations: {
              description: 'If more cassandra pods go down, maddash will stop working',
              summary: 'Cassandra cluster insufficient members'
            },
          },
        ],
      },
    ],
  },
  grafanaDashboards+:: {
    'K8SNvidiaGPU-Cluster.json': (import 'local/K8SNvidiaGPU-Cluster.json'),
    'K8SNvidiaGPU-Node.json': (import 'local/K8SNvidiaGPU-Node.json'),
    'Cassandra-dashboard.json': (import 'local/Cassandra-dashboard.json'),
    'Rook-dashboard.json': (import 'local/Rook-dashboard.json'),
    'Testpoints-mem-dashboard.json': (import 'local/Testpoints-mem-dashboard.json'),
  },
  prometheus+: {
    prometheus+: {
      spec+: {
        retention: '8760h',
        storage: {
          volumeClaimTemplate: {
            metadata: {
              name: 'prometheusvol',
              namespace: 'monitoring',
            },
            spec: {
              storageClassName: 'rook-block',
              resources: {
                requests: {
                  storage: '600Gi',
                },
              },
            },
          },
        },
      },
    },
  },
  cassandra: {
    serviceMonitor: {
       "apiVersion": "monitoring.coreos.com/v1",
       "kind": "ServiceMonitor",
       "metadata": {
          "name": "cassandra-mon",
          "namespace": "monitoring",
          "labels": {
             "k8s-app": "esmond-cassandra"
          }
       },
       "spec": {
          "selector": {
             "matchLabels": {
                "k8s-app": "esmond-cassandra"
             }
          },
          "namespaceSelector": {
             "matchNames": [
                "perfsonar"
             ]
          },
          "endpoints": [
             {
                "port": "exporter",
                "interval": "10s",
                "path": "/metrics"
             }
          ]
       }
    },
    role:
      local role = kp.rbac.v1.role;
      local policyRule = role.rulesType;

      local coreRule = policyRule.new() +
                       policyRule.withApiGroups(['']) +
                       policyRule.withResources([
                         'nodes',
                         'services',
                         'endpoints',
                         'pods',
                       ]) +
                       policyRule.withVerbs(['get', 'list', 'watch']);

      role.new() +
      role.mixin.metadata.withName('prometheus-' + $._config.prometheus.name) +
      role.mixin.metadata.withNamespace('perfsonar') +
      role.withRules(coreRule),
    roleBinding:
      local roleBinding = kp.rbac.v1.roleBinding;

      roleBinding.new() +
      roleBinding.mixin.metadata.withName('perfsonar-mon') +
      roleBinding.mixin.metadata.withNamespace('perfsonar') +
      roleBinding.mixin.roleRef.withApiGroup('rbac.authorization.k8s.io') +
      roleBinding.mixin.roleRef.withName('prometheus-' + $._config.prometheus.name) +
      roleBinding.mixin.roleRef.mixinInstance({ kind: 'Role' }) +
      roleBinding.withSubjects([{ kind: 'ServiceAccount', name: 'prometheus-' + $._config.prometheus.name, namespace: 'monitoring' }]),
  },
  gpu: {
    serviceMonitor: {
       "apiVersion": "monitoring.coreos.com/v1",
       "kind": "ServiceMonitor",
       "metadata": {
          "name": "gpu-mon",
          "namespace": "monitoring",
          "labels": {
             "k8s-app": "gpu-mon"
          }
       },
       "spec": {
          "selector": {
             "matchLabels": {
                "k8s-app": "gpu-mon"
             }
          },
          "namespaceSelector": {
             "matchNames": [
                "gpu-mon"
             ]
          },
          "endpoints": [
             {
                "port": "exporter",
                "interval": "10s",
                "path": "/metrics"
             }
          ]
       }
    },
    role:
      local role = kp.rbac.v1.role;
      local policyRule = role.rulesType;

      local coreRule = policyRule.new() +
                       policyRule.withApiGroups(['']) +
                       policyRule.withResources([
                         'nodes',
                         'services',
                         'endpoints',
                         'pods',
                       ]) +
                       policyRule.withVerbs(['get', 'list', 'watch']);

      role.new() +
      role.mixin.metadata.withName('prometheus-' + $._config.prometheus.name) +
      role.mixin.metadata.withNamespace('gpu-mon') +
      role.withRules(coreRule),
    roleBinding:
      local roleBinding = kp.rbac.v1.roleBinding;

      roleBinding.new() +
      roleBinding.mixin.metadata.withName('gpu-mon') +
      roleBinding.mixin.metadata.withNamespace('gpu-mon') +
      roleBinding.mixin.roleRef.withApiGroup('rbac.authorization.k8s.io') +
      roleBinding.mixin.roleRef.withName('prometheus-' + $._config.prometheus.name) +
      roleBinding.mixin.roleRef.mixinInstance({ kind: 'Role' }) +
      roleBinding.withSubjects([{ kind: 'ServiceAccount', name: 'prometheus-' + $._config.prometheus.name, namespace: 'monitoring' }]),
  },
  rook: {
    serviceMonitor: {
       "apiVersion": "monitoring.coreos.com/v1",
       "kind": "ServiceMonitor",
       "metadata": {
          "name": "rook-mon",
          "namespace": "monitoring",
          "labels": {
             "k8s-app": "rook-mon",
          }
       },
       "spec": {
          "selector": {
             "matchLabels": {
                "app": "rook-api",
                "rook-cluster": "rook",
             }
          },
          "namespaceSelector": {
             "matchNames": [
                "rook"
             ]
          },
          "endpoints": [
             {
                "port": "rook-api",
                "interval": "10s",
                "path": "/metrics"
             }
          ]
       }
    },
    role:
      local role = kp.rbac.v1.role;
      local policyRule = role.rulesType;

      local coreRule = policyRule.new() +
                       policyRule.withApiGroups(['']) +
                       policyRule.withResources([
                         'nodes',
                         'services',
                         'endpoints',
                         'pods',
                       ]) +
                       policyRule.withVerbs(['get', 'list', 'watch']);

      role.new() +
      role.mixin.metadata.withName('prometheus-' + $._config.prometheus.name) +
      role.mixin.metadata.withNamespace('rook') +
      role.withRules(coreRule),
    roleBinding:
      local roleBinding = kp.rbac.v1.roleBinding;

      roleBinding.new() +
      roleBinding.mixin.metadata.withName('rook-mon') +
      roleBinding.mixin.metadata.withNamespace('rook') +
      roleBinding.mixin.roleRef.withApiGroup('rbac.authorization.k8s.io') +
      roleBinding.mixin.roleRef.withName('prometheus-' + $._config.prometheus.name) +
      roleBinding.mixin.roleRef.mixinInstance({ kind: 'Role' }) +
      roleBinding.withSubjects([{ kind: 'ServiceAccount', name: 'prometheus-' + $._config.prometheus.name, namespace: 'monitoring' }]),
  }
};

{ ['00namespace-' + name]: kp.kubePrometheus[name] for name in std.objectFields(kp.kubePrometheus) } +
{ ['0prometheus-operator-' + name]: kp.prometheusOperator[name] for name in std.objectFields(kp.prometheusOperator) } +
{ ['node-exporter-' + name]: kp.nodeExporter[name] for name in std.objectFields(kp.nodeExporter) } +
{ ['kube-state-metrics-' + name]: kp.kubeStateMetrics[name] for name in std.objectFields(kp.kubeStateMetrics) } +
{ ['alertmanager-' + name]: kp.alertmanager[name] for name in std.objectFields(kp.alertmanager) } +
{ ['prometheus-' + name]: kp.prometheus[name] for name in std.objectFields(kp.prometheus) } +
{ ['rook-' + name]: kp.rook[name] for name in std.objectFields(kp.rook) } +
{ ['cassandra-' + name]: kp.cassandra[name] for name in std.objectFields(kp.cassandra) } +
{ ['gpu-' + name]: kp.gpu[name] for name in std.objectFields(kp.gpu) } +
{ ['grafana-' + name]: kp.grafana[name] for name in std.objectFields(kp.grafana) }