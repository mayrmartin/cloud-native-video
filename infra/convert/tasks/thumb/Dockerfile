FROM jrottenberg/ffmpeg

RUN apt-get update && \
    apt-get install python3 python3-pip -y && \
    apt-get clean

RUN pip3 install 'awscli<1.19'

WORKDIR /tmp/workdir

ENTRYPOINT \
    echo "Starting ffmpeg task..." && \
    echo "Copying video from s3://${S3_BUCKET}/${INPUT_VIDEO} to ${INPUT_VIDEO}..." && \
    aws s3 cp s3://${S3_BUCKET}/${INPUT_VIDEO} ./${INPUT_VIDEO} && \
    ffmpeg -v error -i ./${INPUT_VIDEO} -ss ${TIME_OFFSET} -vframes 1 -f image2 -an -y ${OUTPUT_FILE} && \
    echo "Copying thumbnail to S3://${S3_BUCKET}/${OUTPUT_FILE} ....." && \
    aws s3 cp ./${OUTPUT_FILE} s3://${S3_BUCKET}/${S3_DEST_DIR}/${OUTPUT_FILE}