**<h1>Deploying to OpenShift</h1>**

This application was generated using JHipster 7.1.0, you can find documentation and help at https://www.jhipster.tech/.

JHipster uses a sub-generator that allows deployment of JHipster applications to Openshift Container Platform/OpenShift Origin.

# 1. Pre-requisites

You have to install:

- Docker
- Hypervisor - Depending on your OS, you have the choice of different options
  You must have a Docker registry. If you don’t have one, you can use the official Docker Hub

# 2. Running the sub-generator

To generate config files for OpenShift, run this command in the project/root folder:

    jhipster openshift

<H3>Then answer all the questions to deploy your application.</H3>

1.  Which type of application would you like to deploy?

    Select monoliths application.

2.  Enter the root directory where your applications are located

    Enter the path. All the OpenShift generator files will be persisted in this path.

3.  Which applications do you want to include in your OpenShift configuration?

    Select your application.

4.  Do you want to setup monitoring for your applications ?

    In case you want to setup monitoring, select metrics of Prometheus. Otherwise, select NO.

5.  What should we use for the OpenShift namespace?

    Enter an Openshift project space name(e.g: vouchertt)

6.  Which type of database storage would you like to use?

    Select persistent storage.

7.  What should we use for the base Docker repository name?

    If you choose Docker Hub as main registry, it will be your Docker Hub login.

8.  What command should we use for push Docker image to repository?

    The default command to push to Docker Hub is docker image push

# 3. Updating your deployed application

## 3.1 Preparing a new deployment

When your sub-generator is already runned, you can deploy your application by building a new Docker image:

    mvnw package -Pprod -DskipTests jib:dockerBuild

To check your docker image application is successfully generated, and verify **vouchertt** repository

    docker images

## 3.2 Pushing to Docker Hub

Tag locally your image:

    docker image tag vouchertt <docker hub login>/vouchertt

Push your image to Docker Hub:

    docker push <docker hub login>/vouchertt

## 3.3 Deploying application(s)

You can deploy your application by either running (For Linux):

    cd .. & cd ocp/
    ./ocp-apply.sh

OR

    oc apply -f ./registry/scc-config.yml
    oc apply -f ./vouchertt/vouchertt-postgresql.yml
    oc apply -f ./vouchertt/vouchertt-deployment.yml

and then install the application from OpenShift console by choosing the template created in the chosen namespace.

Open the link to show your application:
vouchertt-voucher-print.apps.ocptt.tunisietelecom.tn/
