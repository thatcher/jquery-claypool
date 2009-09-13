
This directory is scanned at startup by the WebAppDeployer
configured in the standard $JETTY_HOME/etc/jetty.xml file.

WAR files, JAR files and directories discovered are deployed
as web application instances.  This directory is not rescanned
for hot deployment (see $JETTY_HOME/contexts for hot deployment).

The directory or file name is used as the basis of the 
context path (eg foo.war will have a context path of /foo).
A directory called root or a webapplication called root.war
will be deployed to the / context path.

By default, the WebAppDeployer avoids duplicate context
paths, so any contexts that have been configured manually
or in $JETTY_HOME/contexts will not be deployed again.
