var app = angular.module('store', []);
// FILTRE POUR L'UNICITE DES CATEGORIES
// here we define our unique filter
app.filter('unique', function() {
  // we will return a function which will take in a collection
  // and a keyname
  return function(collection, keyname) {
    // we define our output and keys array;
    var output = [],
    keys = [];
    // we utilize angular's foreach function
    // this takes in our original collection and an iterator function
    angular.forEach(collection, function(item) {
      // we check to see whether our object exists
      var key = item[keyname];
      // if it's not already part of our keys array
      if(keys.indexOf(key) === -1) {
        // add it to our keys array
        keys.push(key);
        // push this item to our final output array
        output.push(item);
      }
    });
    // return our array which should be devoid of
    // any duplicates
    return output;
  };
});

app.controller('storeController', ['$scope', '$http', function($scope, $http){
  // import des données venant du Json
  $http.get('./assets/js/productsData.json').then(function(data) {
    $scope.products = data.data;
  });
  // variables pour les produits dans le panier et le total
  $scope.cart = [];
  $scope.total = 0;
  $scope.totalCount = 0;
  $scope.categoryFiltered = '';
  // fonction de mise à jour du panier
  $scope.categoryFilter = function (categorySelected) {
    $scope.categoryFiltered = categorySelected;
  }
  // fonction de mise à jour du panier
  $scope.update = function () {
    // Boucle mettant à jour le total d'articles dans le panier
    $scope.totalCount = 0;
    angular.forEach($scope.cart, function (value, key) {
      $scope.totalCount += Number($scope.cart[key].count);
    });
  }
  $scope.update();
  //fonction qui ajoute des produits/item dans le panier---------------------------------------------------------
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
    $scope.update();
    // Met à jour la variable total
    $scope.total += parseFloat(product.price);
  };
  // Retire une quantité d'un produit----------------------------------------------
  $scope.removeItemCart = function(product){
    if(product.count > 1){
      product.count -= 1;
    }else if(product.count === 1){
      var index = $scope.cart.indexOf(product);
      $scope.cart.splice(index, 1);
      product.count = 0;
    }
    $scope.total -= parseFloat(product.price);
    $scope.update();
  };
  // Suppression d'un produit------------------------------------------------------
  $scope.deleteProductInCart = function(product){
    var index = $scope.cart.indexOf(product);
    $scope.cart.splice(index, 1);
    product.count = 0;
    $scope.total = 0;
    $scope.update();
  }
}]);
