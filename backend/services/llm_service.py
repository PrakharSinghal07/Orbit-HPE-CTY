import random

suggestion_bank = [
    "Steps to fix a reboot loop",
    "How to check node logs?",
    "What is an HA cluster?",
    "How to resolve configuration mismatches?",
    "Why does my node hang?",
    "What are SLURM scheduler issues?",
    "How to analyze performance degradation?",
]

def get_llm_response(query: str):
    if query.lower() == "why does my node hang?":
        return "Node hanging can be caused by various factors. Common reasons include: 1. **Hardware Issues**: Faulty RAM, CPU, or hard drive can cause a node to become unresponsive. 2. **Software Bugs**: A crash in the kernel or running application can cause the system to freeze. 3. **Network Latency**: Slow or interrupted network connections can cause a node to hang, especially in cluster environments. 4. **Resource Exhaustion**: When the node runs out of CPU, memory, or disk space, it can stop responding. Ensure that resources are adequately monitored. 5. **Overheating**: Hardware overheating can cause system crashes or unresponsiveness. To resolve the issue, check the system’s hardware health, monitor resource usage, and look for error messages in system logs. If the node is part of a cluster, network issues between nodes may also be a contributing factor."

    elif query.lower() == "what is an ha cluster?":
        return "A High Availability (HA) cluster is a collection of servers designed to work together to ensure continuous service availability, even in case of hardware or software failures. The cluster is typically configured to detect failures in individual nodes and automatically redistribute workloads to healthy nodes. Key components of an HA cluster: 1. **Redundancy**: Multiple servers or nodes that mirror each other's data, ensuring that if one fails, the others can take over. 2. **Failover**: Automatic switching to a backup system or node in case of a failure. 3. **Load Balancing**: Distributing tasks evenly across nodes to prevent overloading any single system. 4. **Fault Tolerance**: The ability of the system to continue functioning even when one or more components fail. HA clusters are commonly used in environments where uptime is critical, such as database servers, web servers, and cloud infrastructure."

    elif query.lower() == "how to resolve configuration mismatches?":
        return "Configuration mismatches occur when the settings between different components or nodes of a system do not align, which can cause system instability or failure. Here’s how to resolve them: 1. **Identify the Mismatch**: First, locate the source of the mismatch. It could be between servers, services, or software versions. Use tools like `diff` or configuration management tools (e.g., Ansible, Puppet) to compare configurations. 2. **Check Documentation**: Ensure that all configuration changes are in line with the official documentation for each service or component. 3. **Update Configuration Files**: Make sure configuration files (like `/etc/network/interfaces`, `/etc/hosts`, or application-specific files) match across all affected systems. 4. **Synchronize Settings**: If working with a cluster, ensure all nodes have the same settings, especially for critical services like databases, firewalls, and load balancers. 5. **Testing**: After applying the changes, run tests to confirm the systems are behaving as expected. Finally, if the configuration mismatch is due to a software update, ensure that the version numbers are aligned across systems, and rollback if necessary."

    elif query.lower() == "how to check node logs?":
        return "Node logs are critical for identifying issues and troubleshooting problems in a system. To check node logs, follow these steps: 1. **System Logs**: On Linux systems, the primary system logs are stored in `/var/log/`. Use the following commands to view the logs: - `sudo cat /var/log/syslog` or `sudo cat /var/log/messages` for system-wide messages. - `sudo tail -f /var/log/dmesg` for kernel messages. - `sudo journalctl` for logs managed by `systemd`. 2. **Application Logs**: If you’re troubleshooting an application or service, check its specific log files. These could be in directories like `/var/log/apache2/` for Apache logs or `/var/log/mysql/` for MySQL logs. 3. **Check Node-Specific Logs**: If the node is part of a cluster, check the logs for the specific node or service in question. For example, Kubernetes node logs can be accessed with `kubectl logs <node-name>`. 4. **Use Log Aggregators**: In large-scale environments, use log aggregation tools like ELK Stack (Elasticsearch, Logstash, and Kibana) or Splunk to centralize and search logs from multiple nodes. Analyzing these logs can provide valuable insights into why a node is hanging or encountering issues."

    elif query.lower() == "what are slurm scheduler issues?":
        return "SLURM (Simple Linux Utility for Resource Management) is a widely-used job scheduler for Linux clusters, but like any complex system, it can encounter issues. Some common SLURM scheduler issues include: 1. **Job Scheduling Failures**: If jobs are not being scheduled as expected, check for issues like resource allocation mismatches, incorrect job priorities, or configuration errors in the `slurm.conf` file. 2. **Job Execution Failures**: Jobs may fail to start due to resource exhaustion, node failures, or misconfigured job scripts. Check SLURM logs (`/var/log/slurm/slurmctld.log`) for detailed error messages. 3. **Node Failures**: SLURM may not properly detect or handle failed nodes, leading to incomplete or misallocated job executions. Check the `slurmd` logs on each node for hardware or software issues. 4. **Database Issues**: SLURM uses a database to store job information. Issues like database corruption or slow performance can impact job scheduling. Ensure the SLURM database is properly maintained. 5. **Configuration Issues**: Misconfigured settings in the SLURM configuration files (`slurm.conf`, `slurmdbd.conf`) can cause various scheduling problems. Always double-check these settings, especially after system updates. To troubleshoot SLURM issues, use commands like `scontrol`, `squeue`, `sacct`, and `sdiag` to gather detailed information about job status and system health."

    elif query.lower() == "what is fastapi?":
        return "FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints. It's built on top of Starlette for the web parts and Pydantic for the data parts. Key features include: 1. **Fast**: Very high performance, on par with NodeJS and Go (thanks to Starlette and Pydantic). 2. **Fast to code**: Increase the speed to develop features by about 200% to 300%. 3. **Fewer bugs**: Reduce about 40% of human (developer) errors. 4. **Easy**: Designed to be easy to use and learn. 5. **Automatic docs**: With FastAPI, you get automatic interactive API documentation (using Swagger UI and ReDoc). FastAPI supports request validation, dependency injection, and asynchronous programming, making it ideal for building robust APIs quickly."

    else:
        return f"Mocked response to: '{query}'" 

def getSuggestions():
    suggestions = random.sample(suggestion_bank, 3)
    return suggestions
