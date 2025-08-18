import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    S3ServiceException,
    HeadObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default class {
    client = new S3Client({
        region: process.env.REGION,
        endpoint: process.env.STORAGE_API,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY as string,
            secretAccessKey: process.env.SECRET_KEY as string
        }
    });

    async put(file: File, key: string) {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: Buffer.from(await file.arrayBuffer())
        });

        try {
            const response = await this.client.send(command);
            console.log(response);
        } catch (e) {
            if (e instanceof S3ServiceException) console.error(
                `Error from S3 while uploading object. ${e.name}: ${e.message}`
            );
            else throw e;
        }
    }

    async get(key: string, size: number) {
        if (!(await this.check(key))) return null;
        const commandParams: any = {
            Bucket: process.env.BUCKET_NAME,
            Key: key
        }

        const limitRate = Number(process.env.DOWNLOAD_RATE_LIMIT)
        if (limitRate && limitRate < 0) commandParams.ResponseMetadata = {
            'x-amz-limit-rate': size.toString()
        }
        else if (limitRate && limitRate > 0) commandParams.ResponseMetadata = {
            'x-amz-limit-rate': limitRate.toString()
        }

        const command = new GetObjectCommand(commandParams);
        try {
            const url = await getSignedUrl(this.client, command, { expiresIn: 300 });
            return url;
        } catch (e) {
            return null;
        }
    }

    async delete(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        });

        try {
            await this.client.send(command);
        } catch (e) {
            if (e instanceof S3ServiceException) console.error(
                `Error from S3 while deleting object. ${e.name}: ${e.message}`,
            );
            else throw e;
        }
    }

    async check(key: string) {
        const command = new HeadObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        });

        try {
            await this.client.send(command);
            return true;
        } catch (e) {
            return false;
        }
    }
}
