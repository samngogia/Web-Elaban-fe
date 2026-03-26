class ImageModel {
    id: number;
    name?: string;
    url?: string;
    isThumbnail?: boolean;
    data?: string; // Cột này hiện đang NULL trong DB của bạn, nhưng cứ để dự phòng

    constructor(
        id: number,
        name: string,
        url: string,
        isThumbnail: boolean,
        data: string
    ) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.isThumbnail = isThumbnail;
        this.data = data;
    }
}
export default ImageModel;