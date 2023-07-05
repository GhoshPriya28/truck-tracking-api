async function Uploader(Req, Folder, FileTypes = ['image/png', 'image/jpeg', 'image/jpg']) {
    let response = {};

    if (Req.files === null) {
        response.status = false;
        response.code = 400;
        response.message = 'No file uploaded';
        return response;
    } else if (Req.files.file.length > 1) {
        response.status = true;
        response.code = 200;
        response.message = 'Files uploaded successfully';
        response.data = {
            fileDetail: []
        };

        for (const File of Req.files.file) {
            if (FileTypes.includes(File.mimetype)) {
                const FileName = File.name;
                const FileExt = File.mimetype.split('/')[1];
                const FileNewName = `${FileName}-${Date.now()}.${FileExt}`;
                const FileNewPath = `./public/uploads/${Folder}/${FileNewName}`;
                const FileUrl = `uploads/${Folder}/${FileNewName}`;
                await File.mv(FileNewPath);
                response.data.fileDetail.push({
                    fileName: FileName,
                    fileUrl: FileUrl
                });
            } else {
                response.status = false;
                response.code = 400;
                response.message = 'File type not supported';
                return response;
            }
        }
    } else {
        const File = Req.files.file;
        if (FileTypes.includes(File.mimetype)) {
            response.status = true;
            response.code = 200;
            response.message = 'File uploaded successfully';
            response.data = {
                fileDetail: []
            };

            const FileName = File.name;
            const FileExt = File.mimetype.split('/')[1];
            const FileNewName = `${FileName}-${Date.now()}.${FileExt}`;
            const FileNewPath = `./public/uploads/${Folder}/${FileNewName}`;
            const FileUrl = `uploads/${Folder}/${FileNewName}`;
            await File.mv(FileNewPath);
            response.data.fileDetail.push({
                fileName: FileName,
                fileUrl: FileUrl
            });
        } else {
            response.status = false;
            response.code = 400;
            response.message = 'File type not supported';
            return response;
        }
    }

    return response;
}

module.exports = Uploader;
