FROM jrottenberg/ffmpeg

RUN apt-get update && \
    apt-get install python3 python3-pip git coreutils python3-docopt -y && \
    apt-get clean

RUN pip3 install 'awscli<1.19'
RUN pip3 install --upgrade "pip < 21.0"

WORKDIR /

RUN git clone https://github.com/flavioribeiro/video-thumbnail-generator.git
RUN cd ./video-thumbnail-generator && chmod a+x build && ./build


ENTRYPOINT \
    echo "Starting thumbnail-generator task..." && \
    echo "Copying video from s3://${S3_BUCKET}/${INPUT_VIDEO} to ${INPUT_VIDEO}..." && \
    cd ./video-thumbnail-generator && \
    aws s3 cp s3://${S3_BUCKET}/${INPUT_VIDEO} ./${INPUT_VIDEO} && \
    ./generator ./${INPUT_VIDEO} ${INTERVAL} 160 90 2 ./${OUTPUT_FILE} && \
    echo "Copying prev to S3://${S3_BUCKET}/${S3_DEST_DIR}/${OUTPUT_FILE} ....." && \
    aws s3 cp ./${OUTPUT_FILE} s3://${S3_BUCKET}/${S3_DEST_DIR}/${OUTPUT_FILE}