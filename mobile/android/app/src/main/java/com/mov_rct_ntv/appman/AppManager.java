package com.mov_rct_ntv.appman;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.PowerManager;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class AppManager {

    Activity mainActivity;

    public AppManager(Activity activity){
        mainActivity = activity;
    }

    public String getAppPath(String appName){
        return mainActivity.getApplicationContext().getFilesDir()+"/"+AppProperties.APP_DEPLOY_ROOT_DIR+"/"+appName;
    }

    public void syncApps(String appName){
        downloadApp(appName);
    }

    private void downloadApp(String appName){
        final DownloadTask downloadTask = new DownloadTask(mainActivity,appName);
        String appUrl = AppProperties.APP_SERVER_BASE_URL + appName + AppProperties.APA_PACKAGE_FILE_EXTENTION;
        downloadTask.execute(appUrl);
    }

    private void deployApp(String appName){
        UnzipManager unzipMgr = new UnzipManager(mainActivity);
        try {
            unzipMgr.unzip(appName);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public class UnzipManager {

        Context context;

        UnzipManager(Context ctx){
            context = ctx;
        }

        public void unzip(String appName) throws IOException {
            String fileZip = context.getFilesDir().getPath()+"/"+AppProperties.APP_PACKAGE_ROOT_DIR+"/"+appName+AppProperties.APA_PACKAGE_FILE_EXTENTION;
            File destDir = new File(context.getFilesDir().getPath()+"/"+AppProperties.APP_DEPLOY_ROOT_DIR+"/"+appName);
            if(!destDir.exists())
                destDir.mkdirs();
            byte[] buffer = new byte[1024];
            ZipInputStream zis = new ZipInputStream(new FileInputStream(fileZip));
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                File newFile = newFile(destDir, zipEntry);
                if(zipEntry.isDirectory()) {
                    zipEntry = zis.getNextEntry();
                    continue;
                }
                FileOutputStream fos = new FileOutputStream(newFile);
                int len;
                while ((len = zis.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }
                fos.close();
                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
            zis.close();
        }

        public File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
            File destFile = new File(destinationDir, zipEntry.getName());
            if(zipEntry.isDirectory())
                destFile.mkdirs();
            else if(!destFile.exists()){
                destFile.createNewFile();
            }
            String destDirPath = destinationDir.getCanonicalPath();
            String destFilePath = destFile.getCanonicalPath();

            if (!destFilePath.startsWith(destDirPath + File.separator)) {
                throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
            }

            return destFile;
        }
    }

    private class DownloadTask extends AsyncTask<String, Integer, String> {

        private Context context;
        private PowerManager.WakeLock mWakeLock;
        private String appName;

        public DownloadTask(Context context, String appName) {
            this.context = context;
            this.appName = appName;
        }

        @Override
        protected String doInBackground(String... sUrl) {
            InputStream input = null;
            OutputStream output = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(sUrl[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.connect();

                // expect HTTP 200 OK, so we don't mistakenly save error report
                // instead of the file
                if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    return "Server returned HTTP " + connection.getResponseCode()
                            + " " + connection.getResponseMessage();
                }

                // this will be useful to display download percentage
                // might be -1: server did not report the length
                int fileLength = connection.getContentLength();

                // download the file
                input = connection.getInputStream();
                File archivedir = new File(context.getFilesDir()+"/"+AppProperties.APP_PACKAGE_ROOT_DIR);
                if(!archivedir.exists())
                    archivedir.mkdirs();
                output = new FileOutputStream(archivedir.getPath()+"/"+appName+AppProperties.APA_PACKAGE_FILE_EXTENTION);

                byte data[] = new byte[4096];
                long total = 0;
                int count;
                while ((count = input.read(data)) != -1) {
                    // allow canceling with back button
                    if (isCancelled()) {
                        input.close();
                        return null;
                    }
                    total += count;
                    // publishing the progress....
                    if (fileLength > 0) // only if total length is known
                        publishProgress((int) (total * 100 / fileLength));
                    output.write(data, 0, count);
                }
            } catch (Exception e) {
                return e.toString();
            } finally {
                try {
                    if (output != null)
                        output.close();
                    if (input != null)
                        input.close();
                } catch (IOException ignored) {
                }

                if (connection != null)
                    connection.disconnect();
            }
            return null;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            // take CPU lock to prevent CPU from going off if the user
            // presses the power button during download
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            mWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                    getClass().getName());
            mWakeLock.acquire();
            //mProgressDialog.show();
        }

        @Override
        protected void onProgressUpdate(Integer... progress) {
            super.onProgressUpdate(progress);
            // if we get here, length is known, now set indeterminate to false
            //mProgressDialog.setIndeterminate(false);
            //mProgressDialog.setMax(100);
            //mProgressDialog.setProgress(progress[0]);
        }

        @Override
        protected void onPostExecute(String result) {
            mWakeLock.release();
            //mProgressDialog.dismiss();
            if (result != null)
                Toast.makeText(context,"Download error: "+result, Toast.LENGTH_LONG).show();
            else {
                Toast.makeText(context, "Deploying app...", Toast.LENGTH_SHORT).show();
                deployApp(appName);
                Toast.makeText(context, "App Deployed!!", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
