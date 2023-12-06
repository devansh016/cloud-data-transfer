# Cloud Based Data Transfer

---

[Cloud Data Transfer](https://cloud-data-transfer-ea5af7a3011c.herokuapp.com/) is an online data transfer platform with the following objectives:

1. Optimize bandwidth consumption using compression algorithms.
2. Improve reliability through distributed compression requests using RabbitMQ AMQP.
3. Improved scalability and reduced cost by dynamically scaling compute resources using Kubernetes.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.
Also create the .env file and add environment variables as mentioned below.

```sh
git clone git@github.com:devansh016/cloud-data-transfer.git
npm install
npm start
```

## Environment Variable Required

```sh
MONGODB_URL =
PORT =
JWT_SECRET =
AWS_ACCESS_KEY_ID =
AWS_SECRET_ACCESS_KEY =
AWS_DEFAULT_REGION =
AWS_S3_BUCKET =
email_host =
email_port =
email_pass =
email_user =
BaseUrl =
AMQP_URL =
```

Your app should now be running on [localhost](http://localhost/) at port 80.

### Sytem Design

![Sytem Design](/resources/design.png "Sytem Design")
g
## License

Distributed under the MIT License. See [LICENSE](/LICENSE) for more information.
