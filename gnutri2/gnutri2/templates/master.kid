<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?python import sitetemplate ?>
<html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:py="http://purl.org/kid/ns#"
    py:extends="sitetemplate">

    <head py:match="item.tag=='{http://www.w3.org/1999/xhtml}head'">
        <meta content="text/html; charset=UTF-8"
            http-equiv="content-type" py:replace="''"/>
        <title py:replace="''">Your title goes here</title>
        <meta py:replace="item[:]"/>
        <script src="/tg_js/MochiKit.js"></script>
    </head>

<body py:match="item.tag=='{http://www.w3.org/1999/xhtml}body'">
    &gt;&gt;GNUtri

    <div py:if="tg_flash" class="flash" py:content="tg_flash"></div>

    <div py:replace="item[:]"/>
    <hr/>
    dado1945 &copy;
</body>
</html>
