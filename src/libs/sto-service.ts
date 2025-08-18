import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsCommand,
  CopyObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
  DeleteBucketCommand,
  S3ServiceException
} from "@aws-sdk/client-s3";

export default class {
    client = new S3Client({
            endpoint: process.env.STORAGE_API,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY as string,
                secretAccessKey: process.env.SECRET_KEY as string,
            }
        });

    async put(file: File, key: string) {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: Buffer.from(await file.arrayBuffer()),
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
    };
}