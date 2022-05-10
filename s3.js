const aws = require('aws-sdk')
const crypto = require('crypto')
const { promisify } = require('util')

const randomBytes = promisify(crypto.randomBytes)


const region = "us-east-2"
const bucketName = "banjman-project-app"
const accessKeyId = "AKIA4NN4JOAXYZSA642O"
const secretAccessKey = "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"

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

async function generateUploadURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params)
    return uploadUrl
}

module.exports = {generateUploadURL}