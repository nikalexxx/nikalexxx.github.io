export default fileUrl => (new URL(fileUrl)).pathname.split('/').slice(1, -1).join('/');
