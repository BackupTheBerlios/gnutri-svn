<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:py="http://purl.org/kid/ns#"
    py:extends="'master.kid'">

<head>
    <meta
        content="text/html; charset=UTF-8"
        http-equiv="content-type" py:replace="''"/>
        <title>Edit</title>

    <script type="text/javascript">
        function searchProducts() {
            var url = "${std.url('/')}" + "search?tg_format=json&amp;keyword=";
            url += getElement('keyword').value;
            var d = loadJSONDoc(url);
            d.addCallback(showProducts);
        }

        function showProducts(result) {
            result["products"].push(
                    INPUT({"type": "text", "name": "newproduct"}, null))
            var products =
                TABLE({'class': 'products'},
                        THEAD(null, null),
                        TFOOT(null, null),
                        TBODY(null,
                            map(row_display, result["products"])));
            replaceChildNodes("products", products);
        }

        function row_display(row){
            //return LI(null, A({"href" : "${std.url('/')}" + pagename}, pagename))
            var button = INPUT({"type": "button", "value": "+"}, null);

            return TR(null, [TD(null, row), TD(null, button)]);
        }

        function newProduct(){
        
        }

        function onKey(e, func){
            if (e.keyCode == 13)
            {
                func()
            }
        }

    </script>

</head>
<body>
    <div><div py:replace="name">now</div></div>
    <div class="user">
        user | settings | logout
    </div>
    <div class="search">
        <input type="text" name="keyword" id="keyword"
            onkeyup="onKey(event, searchProducts)"/>
        <input type="button" value="search" onclick="searchProducts()"/>
    </div>
    <div class="products" id="products">
        <TABLE>
            <TR>
                <TD>
                    <input type="text" name="newproduct" id="newproduct"
                    onkeyup="onKey(event, newProduct)"/>
                </TD>
                <TD>
                    <input type="button" value="+" onclick="newProduct()"/>
                </TD>
            </TR>
        </TABLE>
    </div>
    <div class="name">
        <input type="text" name="name" py:attrs="value=name"/>
    </div>
    <div class="decription">
        <textarea name="description" py:content="description" rows="10" cols="60"/>
    </div>
    <div class="energetic">
        energetic
    </div>
    <div class="ingredients">
        ingredients
    </div>
    <div class="tags">
        tags
    </div>
</body>
</html>
