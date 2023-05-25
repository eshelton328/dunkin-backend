import { ObjectId } from "mongodb";
import { GridFSBucket } from 'mongodb';
import db from "../conn.mjs";
import stream from 'stream';

export const createReport = async (fileName, csvString, bucketName) => {
    try {
        const bucket = new GridFSBucket(db, { bucketName: bucketName })
        
        const readableStream = new stream.Readable({
            read() {
                this.push(csvString);
                this.push(null);
            },
        });
        
        const fileId = new ObjectId();

        const uploadStream = bucket.openUploadStream(fileName, { _id: fileId });

        readableStream.pipe(uploadStream).on('error', console.error).on('finish', () => {
            console.log('CSV uploaded successfully');
        });

        return fileId.toString();
    } catch (error) {
        console.error(`Reports: there was an error with createReport: ${error}`)
        return false;
    }
}

export const getReportByFileName = async (filename, bucketname) => {
    try {
        const bucket = new GridFSBucket(db, { bucketName: bucketname });
        const query = { filename: filename };
        const file = await bucket.find(query).toArray();

        if (file.length === 0) {
            console.error('Reports: no file found with the given filename');
            return false;
        }

        const fileId = file[0]._id;
        const downloadStream = await bucket.openDownloadStream(ObjectId(fileId));

        downloadStream.on('error', (error) => {
            console.error(`Reports: there was an error with getReportByFileName: ${error}`);
        });

        return downloadStream;
    } catch (error) {
        console.error(`Reports: there was an error with getReportByFileName: ${error}`);
        return false;
    }
}

export const deleteReportByFileName = async (filename, bucketname) => {
    try {
        const bucket = new GridFSBucket(db, { bucketName: bucketname });
        const query = { filename: filename };

        const file = await bucket.find(query).toArray();

        if (file.length > 0) {
            const fileId = file[0]._id;
            await bucket.delete(ObjectId(fileId));
            console.log('File deleted successfully');
        } else {
            console.log('File not found');
        }

        return true;
    } catch (error) {
        console.error(`Reports: there was an error with deleteReportByFileName: ${error}`);
        return false;
    }
}