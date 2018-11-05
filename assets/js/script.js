var app = angular.module('store', ['ngCookies']);

app.controller('storeController', ['$scope', '$cookies', '$http', function($scope, $cookies, $http){
  // import des données venant du Json
  $http.get('./assets/js/productsData.json').then(function(data) {
    $scope.products = data.data;
  });
  // variables pour les produits dans le panier et le total
  $scope.cart = [];
  $scope.total = 0;
  //condition qui met à jour le total s'il y a des données dans les cookies
  if(!angular.isUndefined($cookies.get('total'))){
    $scope.total = parseFloat($cookies.get('total'));
  }
  //condition qui met à jour le panier s'il y a des données dans les cookies
  if (!angular.isUndefined($cookies.get('cart'))) {
      $scope.cart =  $cookies.getObject('cart');
  }
  //fonction qui ajoute des produits dans le panier
  $scope.addItemToCart = function(product){
    //condition qui vérifie si le panier est vide
    if ($scope.cart.length === 0){
      product.count = 1;// mets le compte des produits à 1
      $scope.cart.push(product);// ajoute le produit à la liste du panier
    } else {
      var repeat = false; // variable vérifiant la cohérence entre le panier et la liste des produits par l'id
      for(var i = 0; i< $scope.cart.length; i++){
        if($scope.cart[i].id === product.id){
          repeat = true;
          $scope.cart[i].count +=1;
        }
      }
      if (!repeat) {
        product.count = 1;
        $scope.cart.push(product);
      }
    }
    var expireDate = new Date();// variable servant à lexpiration des cookies
    expireDate.setDate(expireDate.getDate() + 1);// 
    $cookies.putObject('cart', $scope.cart,  {'expires': expireDate});
    $scope.cart = $cookies.getObject('cart');

    $scope.total += parseFloat(product.price);
    $cookies.put('total', $scope.total,  {'expires': expireDate});
   };

   $scope.removeItemCart = function(product){

     if(product.count > 1){
       product.count -= 1;
       var expireDate = new Date();
       expireDate.setDate(expireDate.getDate() + 1);
       $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
       $scope.cart = $cookies.getObject('cart');
     }
     else if(product.count === 1){
       var index = $scope.cart.indexOf(product);
     $scope.cart.splice(index, 1);
     expireDate = new Date();
     expireDate.setDate(expireDate.getDate() + 1);
     $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
     $scope.cart = $cookies.getObject('cart');

     }

     $scope.total -= parseFloat(product.price);
     $cookies.put('total', $scope.total,  {'expires': expireDate});

   };

}]);
